(() => {
    console.log("URL: ", document.URL);

    let qns = [];
    let curr_query = "";
    let index = -1;
    let size = 0;
    // DOM elements
    let scrollDownBtn;
    let form;
    let prompt;
    // Scrolls us down to response automatically and update index and size
    function handleSubmit() {
        console.log("handleSubmit executing");
        scrollDownBtn = document.querySelector('[class^="react-scroll-to-bottom--css"]')?.lastChild;
        if (scrollDownBtn) scrollDownBtn.click(); // Ensure scrollDownBtn exists
        size++;
        index = size;
        qns.push(curr_query);
        console.log("Number of queries in chat:", qns.length);
    }
    // Increments the size of the code by 50px symmetrically
    function incrementSize(ele) {
        let snippet = ele.clientWidth;
        let newRight = Number(ele.style.right.slice(0, -2)) + 25;
        ele.style.right = newRight + "px";
        let newSize = 50 + Number(snippet);
        ele.style.width = "" + newSize + "px";
    }
    // Decrements the size of the code by 50px symmetrically until threshold
    function decrementSize(ele) {
        let snippet = ele.clientWidth;
        if (snippet < 517) return;
        let newRight = Number(ele.style.right.slice(0, -2)) - 25;
        ele.style.right = newRight + "px";
        let newSize = Number(snippet) - 50;
        ele.style.width = "" + newSize + "px";
    }
    // Increments the size of the chat by 50px symmetrically
    function incrementWholeSize() {
        let ele = document.querySelector("[data-testid^='conversation-turn']").firstChild
            .firstChild;
        console.log(ele);
        let snippet = ele.clientWidth;
        let newRight = Number(ele.style.right.slice(0, -2)) + 25;
        ele.style.right = newRight + "px";
        let newSize = 50 + Number(snippet);
        document.querySelectorAll("[data-testid^='conversation-turn']").forEach((ele) => {
            ele.firstChild.firstChild.style.maxWidth = "" + newSize + "px";
        });
    }
    // Decrements the size of the chat by 50px symmetrically until threshold
    function decrementWholeSize() {
        let ele = document.querySelector("[data-testid^='conversation-turn']").firstChild
            .firstChild;
        let snippet = ele.clientWidth;
        if (snippet < 517) return;
        let newRight = Number(ele.style.right.slice(0, -2)) - 25;
        ele.style.right = newRight + "px";
        let newSize = Number(snippet) - 50;
        document.querySelectorAll("[data-testid^='conversation-turn']").forEach((ele) => {
            ele.firstChild.firstChild.style.maxWidth = "" + newSize + "px";
        });
    }
    // Effectively detects a click-type submit by targetting the right element
    function formClickHandler(event) {
        const clickedElement = event.target;
        if (
            clickedElement.matches("button") ||
            clickedElement.matches("svg") ||
            clickedElement.matches("path")
        ) {
            handleSubmit();
        }
    }
    // Handles the key-based events of the input textarea
    // Enter -> Submit
    // Up arrow -> previous query
    // Down arrow -> Next Query
    function promptKeyHandler(event) {
        if (event.key === "Enter") {
            handleSubmit();
        } else if (event.key === "ArrowUp") {
            if (index > 0) {
                index--;
                curr_query = prompt.innerHTML;
                document.getElementsByTagName("textarea")[0].value = qns[index];
                document
                    .getElementsByTagName("textarea")[0]
                    .dispatchEvent(new Event("input"), { bubbles: true });
            }
        } else if (event.key === "ArrowDown") {
            if (index < size - 1) {
                index++;
                curr_query = prompt.innerHTML;
                document.getElementsByTagName("textarea")[0].value = qns[index]; // not innerHTML
                document
                    .getElementsByTagName("textarea")[0]
                    .dispatchEvent(new Event("input"), { bubbles: true });
            }
        }
    }
    // Styles the pageSizer button
    function stylePageButton(button) {
        button.style.border = "solid 1.5px #828282";
        button.style.fontSize = "larger";
        button.style.width = "100%";
        button.style.borderRadius = "7px";
        button.style.marginRight = "10px";
    }
    // Styles the codeSizer button
    function styleCodeButton(button) {
        button.style.border = "solid 1.5px #828282";
        button.style.fontSize = "larger";
        button.style.width = "17px";
        button.style.borderRadius = "5px";
    }
    // Function to toggle between showing full query and just 150px
    function toggleQuery(button, ele) {
        if (button.innerHTML === "🢓") {
            ele.style.height = "auto";
            button.innerHTML = "🢑";
            button.style.top = "10px";
            button.style.bottom = "auto";
        } else if (button.innerHTML === "🢑") {
            ele.style.height = "150px";
            button.innerHTML = "🢓";
            button.style.top = "auto";
            button.style.bottom = "25px";
        }
    }
    // Function to add tha codeSizer btns
    function addCodeBtns(parent) {
        Array.from(parent.getElementsByTagName("pre")).forEach((ele) => {
            ele.style.position = "relative";
            ele.style.right = "0px";
            if (ele.lastElementChild.firstElementChild.childNodes.length === 2) {
                let span = document.createElement("span");
                span.style.width = "50px";
                span.style.display = "flex";
                span.style.justifyContent = "space-between";
                let button = document.createElement("button");
                button.onclick = () => incrementSize(ele);
                button.innerHTML = "+";
                styleCodeButton(button);
                span.appendChild(button);
                button = document.createElement("button");
                button.innerHTML = "-";
                styleCodeButton(button);
                button.onclick = () => decrementSize(ele);
                span.appendChild(button);
                span.setAttribute("class", "codeSizer");
                ele.lastElementChild.firstElementChild.insertBefore(
                    span,
                    ele.lastElementChild.firstElementChild.lastChild
                );
            }
        });
    }
    // Function to add the toggler to your query
    function addQueryToggler(ele) {
        if (ele.clientHeight > 150) {
            ele.style.height = "150px";
            ele.style.overflow = "hidden";
            ele.style.boxShadow = "inset 0 -30px 30px -30px #000000";
            ele.style.paddingLeft = "10px";
            ele.style.borderRadius = "5px";
            let button = document.createElement("button");
            button.style.position = "absolute";
            button.style.right = "8px";
            button.style.bottom = "25px";
            button.innerHTML = "🢓";
            button.style.fontSize = "2rem";
            button.onclick = () => toggleQuery(button, ele);
            ele.appendChild(button);
        }
    }
    // Called when a new query is made so as to add toggler and add codeSizers
    function handleNewConversation(addedNode) {
        console.log("Conversation no:", addedNode.getAttribute("data-testid").slice(18));
        if (Number(addedNode.getAttribute("data-testid").slice(18)) % 2 === 0) {
            // user query
            let ele = addedNode.querySelector("[data-message-author-role='user']");
            addQueryToggler(ele);
        } else {
            addedNode.querySelector("[data-message-author-role='assistant']").style.overflow =
                "visible";
            const observer = new MutationObserver((mutations) => {
                addCodeBtns(addedNode);
            });

            observer.observe(
                addedNode.firstChild.firstChild.lastChild.lastChild.lastChild.firstChild,
                { childList: true, attributes: true, subtree: true }
            );
        }
    }
    // Called when the page fully loads
    function addExtension() {
        // Event delegation on the form and prompt
        form.addEventListener("click", formClickHandler);
        prompt.addEventListener("keyup", promptKeyHandler);

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    for (const addedNode of mutation.addedNodes) {
                        if (
                            addedNode.nodeType === Node.ELEMENT_NODE &&
                            addedNode.nodeName !== "BUTTON"
                        ) {
                            // New child element added!
                            console.log("New child element added:", addedNode);
                            handleNewConversation(addedNode);
                        }
                    }
                }
            }
        });

        observer.observe(
            document.querySelector('[class^="react-scroll-to-bottom--css"]').firstChild.firstChild,
            { childList: true }
        );
        document.querySelectorAll("[data-message-author-role='user']").forEach((ele) => {
            size++;
            qns.push(ele.lastChild.innerHTML);
            addQueryToggler(ele);
        });
        document
            .querySelectorAll("[data-message-author-role='assistant']")
            .forEach((ele) => (ele.style.overflow = "visible"));
        if (document.getElementsByClassName("pageSizer").length === 0) {
            let span = document.createElement("span");
            span.style.width = "80px";
            span.style.display = "flex";
            span.style.justifyContent = "space-between";
            let button = document.createElement("button");
            button.onclick = () => incrementWholeSize();
            button.innerHTML = "+";
            stylePageButton(button);
            span.appendChild(button);
            button = document.createElement("button");
            button.innerHTML = "-";
            stylePageButton(button);
            button.onclick = () => decrementWholeSize();
            span.appendChild(button);
            span.setAttribute("class", "pageSizer");
            document
                .getElementsByClassName("sticky")[1]
                .lastChild.insertBefore(
                    span,
                    document.getElementsByClassName("sticky")[1].lastChild.lastChild
                );
        }
        addCodeBtns(document);

        index = size; // set to last query
    }
    // Determines if our extension features are added or not
    let added = false;

    // Callback function to execute when mutations are observed
    function callback(mutationList, observer) {
        // Use traditional 'for loops' for IE 11
        if (document.querySelector("[data-message-author-role='user']")) {
            console.log("Fully loaded...");
            if (!added) {
                // Update the dom object refs
                scrollDownBtn = document.querySelector(
                    '[class^="react-scroll-to-bottom--css"]'
                )?.lastChild;
                form = document.getElementsByTagName("form")[0];
                prompt = document.getElementsByTagName("textarea")[0];
                qns = []; // for now re-intialize everything
                addExtension();
                added = true;
            }
        }
    }

    // Receives messages from service worker to update the element variables if we move to a new chat
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { url } = obj;
        console.log("URL is", url);
        added = false;
        curr_query = "";
        index = -1;
        size = 0;
        console.log("Reinitialized variables...");
        const observer = new MutationObserver(callback);
        observer.observe(document.getElementsByTagName("main")[0], {
            attributes: true,
            childList: true,
            subtree: true,
        });
        console.log("Waiting for chat to load...");
        response("Initialized");
    });
})();
