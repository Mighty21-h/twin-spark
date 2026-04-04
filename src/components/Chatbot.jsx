import { useEffect } from "react";

function Chatbot() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "LcQ0MMmQnPmJ6oznmMv1V";
        script.domain = "www.chatbase.co";
        script.async = true;
        document.body.appendChild(script);

        // Chatbase initialization snippet
        if (!window.chatbase || window.chatbase("getState") !== "initialized") {
            window.chatbase = (...args) => {
                if (!window.chatbase.q) { window.chatbase.q = [] }
                window.chatbase.q.push(args);
            };
            window.chatbase = new Proxy(window.chatbase, {
                get(target, prop) {
                    if (prop === "q") { return target.q }
                    return (...args) => target(prop, ...args)
                }
            });
        }

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return null;
}

export default Chatbot;
