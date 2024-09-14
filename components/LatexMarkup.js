import React, { useEffect, useState } from 'react';
import propTypes from "prop-types";
import classnames from "classnames";

const LatexMarkup = ({ label, latex, className }) => {
    const [mathLive, setMathLive] = useState(null);

    useEffect(() => {
        async function loadMathLive() {
            const mathLive = await import('mathlive');
            setMathLive(mathLive);
        }
        loadMathLive();
    }, []);

    function markup() {
        if (mathLive) {
            const newLatex = latex.replace(/\/dash/g, "______");
            let markup = "";
            const words = newLatex?.split(" ");
            words?.forEach((word) => {
                let newWord = word;
                if(word?.includes("/eqtn")) {
                    try {
                        newWord = mathLive.convertLatexToMarkup(word?.slice(5), {
                            mathstyle: "displaystyle",
                            onError: (error) => {
                                console.error("Error converting LaTeX to markup:", error);
                            },
                        });
                    } catch(error) {
                        console.log("Conversion Error", error.message);
                    }
                }
                if(word?.includes(".png")) {
                    try {
                        newWord = word;
                    } catch(error) {
                        console.log("image upload Error", error.message);
                    }
                }
                markup += newWord + " ";
            });
            return { __html: markup };
        } else {
            return { __html: "" };
        }
    }

    if (!latex) return null;

    return (
        <p className={classnames(className)} style={{ whiteSpace: "pre-line" }} suppressHydrationWarning>
            {label && label} {typeof window !== "undefined" && <span dangerouslySetInnerHTML={markup()} />}
        </p>
    );
};

LatexMarkup.propTypes = {
    label: propTypes.string,
    latex: propTypes.string,
    className: propTypes.oneOfType([propTypes.string, propTypes.bool]),
};

export default LatexMarkup;