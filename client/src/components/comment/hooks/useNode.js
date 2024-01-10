
const useNode = () => {
    const insertNode = (tree, commentId, item) => {
        if(tree.id === commentId){
            tree.items.push({
                id: new Date().getTime(),
                name: item,
                items: []
            })
            return tree
        }
        let latestNode = []
        latestNode = tree.items.map((ob)=>{
            return insertNode(ob, commentId, item)
        })
        return {...tree, items: latestNode}
    }

    const deleteNode = (tree, id) => {
        for(let i = 0; i < tree.items.length; i++) {
            const currentItem = tree.items[i]
            if(currentItem.id === id){
                tree.items.splice(i, 1)
                return tree
            }else{
                deleteNode(currentItem, id)
            }
        }
        return tree
    }

    return { insertNode, deleteNode }
}

export default useNode