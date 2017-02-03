
var buttons = class {

    static delete(page, id) {
        return '<a href="/'+page+'-delete?id='+id+'" tabindex="-1"><paper-button raised>Delete</paper-button></a>';    
    }

    static edit(page, id) {
        return '<a href="/'+page+'-edit?id='+id+'" tabindex="-1"><paper-button raised>Edit</paper-button></a>';    
    }

    static tagSelectable(tagData) {
        return `<span onClick="_selectTag(event, '${tagData.tag}')" style="color:#${tagData.color}">${tagData.tag}</span>`;
    }
}