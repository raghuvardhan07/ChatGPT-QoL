console.log("im in chat gpt");

console.log('Chat loaded');
console.log(document.URL);
let qns = []
let curr_query = ""
let index = -1
let size = 0
let scrollDownBtn = document.querySelector('[class^="react-scroll-to-bottom--css"]')?.lastChild;
function handleSubmit() {
    console.log("handleSubmit executing");
    console.log(curr_query);
    scrollDownBtn = document.querySelector('[class^="react-scroll-to-bottom--css"]')?.lastChild;
    if (scrollDownBtn) scrollDownBtn.click(); // Ensure scrollDownBtn exists
    index++;
    size++;
    qns.push(curr_query)
    console.log(qns.length);
}

function addExtension() {
    // Event delegation on the form
    const form = document.getElementsByTagName("form")[0];
    const prompt = document.getElementsByTagName("textarea")[0]
    form.addEventListener("click", (event) => {
        const clickedElement = event.target;
        if (clickedElement.matches("button") || clickedElement.matches("svg") || clickedElement.matches("path")) { 
            handleSubmit();
        }
    });
    prompt.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
        else if (event.key === "ArrowUp") {
            if (index > 0) {
                index--;
                curr_query = prompt.innerHTML
                console.log(document.getElementsByTagName("textarea")[0]);
                document.getElementsByTagName("textarea")[0].value = qns[index]
                document.getElementsByTagName("textarea")[0].dispatchEvent(new Event('input'), {bubbles: true});
                console.log(qns[index]);
            }
            
        }
        else if (event.key === "ArrowDown") {
            if (index < size - 1) {
                index++;
                curr_query = prompt.innerHTML
                document.getElementsByTagName("textarea")[0].value = qns[index] // not innerHTML
                document.getElementsByTagName("textarea")[0].dispatchEvent(new Event('input'), {bubbles: true});
                console.log(qns[index]);
            }
        }
        else {
            curr_query = prompt.innerHTML
            console.log(curr_query);
        }
    });

    document.querySelectorAll("[data-message-author-role='user']").forEach((ele) => {
        index++;
        size++;
        qns.push(ele.lastChild.innerHTML)
    })
}

let added = false
// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationList, observer) {
    // Use traditional 'for loops' for IE 11
    if (document.querySelector("[data-message-author-role='user']")) {
        console.log("User question added!");
        if (!added) {
            addExtension();
            added = true
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

observer.observe(document.getElementsByTagName('main')[0], config)

