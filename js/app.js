import FormComponent from "./FormComponent.js";
import ResultListComponent from "./ResultListComponent.js";

const resultList = new ResultListComponent({ containerSelector: '#app-container' });
const form = new FormComponent({ containerSelector: '#app-container', resultList });


form.addElement();
resultList.addElement();


function foo() {};

foo.prototype = {};

window.foo = foo;

window.foo2 = function foo2() {};