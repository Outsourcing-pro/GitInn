// highlight.js
import Hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
Hljs.highlightCode = function () { //自定义highlightCode方法，将只执行一次的逻辑去掉
    let blocks = document.querySelectorAll('pre code');
    [].forEach.call(blocks, Hljs.highlightBlock);
};
export default Hljs