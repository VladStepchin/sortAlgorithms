class ArrayModel {
    constructor(arrayLength = 10) {
        this.arrayModel = [];
        this.itemsCount = arrayLength;
    }

    generateArray() {
        return Array.from({ length: this.itemsCount }, () => this.getRandomInt(100));
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
}

class ArrayViewModel {
    constructor(inputArray, viewElement) {
        this.arrayModel = [...inputArray];
        this.arrayViewModel = [];
        this.arrayViewRendition = viewElement;
        this.renderViewArray();
    }

    renderViewArray() {
        this.arrayModel.forEach((item) => {
            let div = document.createElement('div');
            div.classList.add("item");
            div.innerHTML = item;
            div.style.height = `${5 * item}px`;

            this.arrayViewModel.push(div);
            this.arrayViewRendition.appendChild(div);
        })
        return this.arrayViewModel;
    }

    changeAnimation(args) {
        let [swapElement1, swapElement2] = args;
        this.removeAnimationClasses();
        this.arrayViewModel[swapElement1].classList.add('selectLeft');
        this.arrayViewModel[swapElement2].classList.add('selectRight');
    }

    fakeChangeAnimation(args) {
        let [swapElement1, swapElement2] = args;
        this.removeAnimationClasses();
        this.arrayViewModel[swapElement1].classList.add('fakeSelect');
        this.arrayViewModel[swapElement2].classList.add('fakeSelect');
    }

    swap(args) {
        let [swapElement1, swapElement2, value1, value2] = args;
        this.arrayViewModel[swapElement1].innerHTML = value2;
        this.arrayViewModel[swapElement2].innerHTML = value1;
        this.arrayViewModel[swapElement1].style.height = `${5 * value2}px`;
        this.arrayViewModel[swapElement2].style.height = `${5 * value1}px`;
    }

    removeAnimationClasses() {
        this.arrayViewModel.forEach((item) => {
            item.classList.remove("selectRight")
            item.classList.remove("selectLeft")
            item.classList.remove("fakeSelect")
        })
    }
}

class EventEmitter {
    constructor() {
        this.events = [];
    }

    emit(eventName, data) {
        // change to if
        // emit should never cause an error
        this.events[eventName] ? this.events[eventName].forEach(fn => fn(data)) : null;
    }

    subscribe(eventName, fn) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(fn);
    }

    unsubscribe(fnRemove) {
        this.events = this.events.filter(fn => {
            fn !== fnRemove
        })
    }
}

class BaseSortAlgorithm extends EventEmitter {
    constructor(arrayToSort) {
        super()
        this.arrayModel = arrayToSort;
    }

    itemsSwap(item1, item2) {
        this.arrayModel[item1] = this.arrayModel[item1] + this.arrayModel[item2];
        this.arrayModel[item2] = this.arrayModel[item1] - this.arrayModel[item2];
        this.arrayModel[item1] = this.arrayModel[item1] - this.arrayModel[item2];
    }
}

class SortAlgorithm extends BaseSortAlgorithm {
    constructor(array) {
        super(array);
    }

    async sortWrapper(sortingAlgorithm) {
        let itemsGenerator = null;
        
        switch (sortingAlgorithm) {
            case 'bubble':
                itemsGenerator = this.bubbleSort();
                break;
            case 'selection':
                itemsGenerator = this.selectionSort();
                break;
        }
        for (let pairOfItems of itemsGenerator) {
            let [item1, item2] = pairOfItems;
            
            if (this.arrayModel[item1] > this.arrayModel[item2]) {
                this.emit('event:change-animation', [item1, item2])
                await new Promise(resolve => setTimeout(resolve, 2000));
                this.emit('event:swap', [item1, item2, this.arrayModel[item1], this.arrayModel[item2]])
                this.itemsSwap(item1, item2)
            }
            else {
                this.emit('event:fake-change-animation', [item1, item2])
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
     *bubbleSort() {
        for (let i = 0; i < this.arrayModel.length; i++) {
            for (let j = 0; j < this.arrayModel.length - 1; j++) {
                yield [j, j + 1];
                // if check should be here but not in sortWrapper
            }
        }
    }

    *selectionSort() {
        // try to remove arrayViewModel.removeAnimationClasses();
        for (let i = 0; i < this.arrayModel.length; i++) {
            let min = i;
            for (let j = i; j < this.arrayModel.length; j++) {
                arrayViewModel.removeAnimationClasses();
                if (this.arrayModel[j] < this.arrayModel[min]) {
                     min = j;
                }
            }
            if (min != i) {
                 // if check should be here but not in sortWrapper
                yield [i, min];
            }
        }
    }
}

const viewElement = document.getElementById("items-wrapper");

const array = new ArrayModel();
const arrayModel = array.generateArray();
const arrayViewModel = new ArrayViewModel(arrayModel, viewElement);
const sortAlgorithm = new SortAlgorithm(arrayModel);

sortAlgorithm.subscribe('event:swap', (args) => {
    arrayViewModel.swap(args);
})

sortAlgorithm.subscribe('event:change-animation', (args) => {
    arrayViewModel.changeAnimation(args);
})

sortAlgorithm.subscribe('event:fake-change-animation', (args) => {
    arrayViewModel.fakeChangeAnimation(args);
})

const dropdownSelect = document.getElementById('algorithms')
const actionbButton = document.getElementById('action')

actionbButton.onclick = (() => {
    switch (dropdownSelect.value) {
        case 'bubble':
            sortAlgorithm.sortWrapper('bubble');
            break;
        case 'selection':
            sortAlgorithm.sortWrapper('selection');
            break;
    }
})

// Robomongo install
// Mongo in docker
// Book about Mongo in Console
//