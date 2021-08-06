class ItemsCache {
    #items = {}

    _parseToMap = (items) => {
        this.#items = {}
        items.forEach(item => {
            this.#items[item.name] = { ...item };
        });
    }

    getAll = () => Object.values(this.#items)

    get = (itemName) => ({...this.#items[itemName]})

    set = (newItems) => this._parseToMap(newItems);

    updateitem = (itemName, newitem) => this.#items = {
        ...this.#items,
        [itemName]: {...this.#items[itemName], ...newitem}
    }
}

module.exports = new ItemsCache()