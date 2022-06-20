export const searchUser = (e, defaultItem, items) => {
    console.log(defaultItem)
    const isSelected = defaultItem.filter(item => item.firstName.toLowerCase().startsWith(e.target.value) && item.lastName.toLowerCase().startsWith(e.target.value))
    let newItemList = items.filter(item => item.lastName.toLowerCase().startsWith(e.target.value) && item.firstName.toLowerCase().startsWith(e.target.value) && isSelected.length === 0);
}

export const searchRole = (e, defaultItem, items) => {
    console.log(defaultItem)
    const isSelected = defaultItem.filter(item => item.name.toLowerCase().startsWith(e.target.value))
    let newItemList = items.filter(item => item.name.toLowerCase().startsWith(e.target.value) && isSelected.length === 0);
}