import React, { useEffect } from 'react';
import styles from '../styles/Calculator.module.css';
import $ from 'jquery';
import Head from 'next/head';

const ScientificCalculator = ({ handleClose }) => {
    useEffect(() => {
        // $("#keyPad").draggable({
        //     start: function () {
        //         $(this).css({ height: "auto", width: "463px" });
        //     },
        //     stop: function () {
        //         $(this).css({ height: "auto", width: "463px" });
        //     },
        // });
        
        $("#calc_min").on("click", function () {
            $("#mainContentArea").toggle();
            $("#keyPad_Help").hide();
            $("#keyPad_Helpback").hide();
            $(".help_back").hide();
            $("#keyPad").addClass("reduceWidth");
            $("#helptopDiv span").addClass("reduceHeader");
            $(this).removeClass("calc_min").addClass("calc_max");
        });
      
        $(".calc_max").on("click", function () {
            $(this).removeClass("calc_max").addClass("calc_min");
            $("#mainContentArea").toggle();
            if ($("#helpContent").css("display") == "none") {
                $("#keyPad_Help").show();
            } else {
                $("#keyPad_Helpback").show();
            }
            $("#keyPad").removeClass("reduceWidth");
            $("#helptopDiv span").removeClass("reduceHeader");
        });
      
        $("#closeButton").on("click",function () {
            $("#loadCalc").hide();
        });
    
        $("#keyPad_Help").on("click", function () {
            $(this).hide();
            $("#keyPad_Helpback").show();
            $("#text_container").hide();
            $("#left_sec").hide();
            $("#keyPad_UserInput1").hide();
            $("#helpContent").show();
        });
    
        $("#keyPad_Helpback").on("click", function () {
            $(this).hide();
            $("#keyPad_Help").show();
            $("#text_container").show();
            $("#left_sec").show();
            $("#keyPad_UserInput1").show();
            $("#helpContent").hide();
        });
    }, [])
    
    return (
        <>
            <Head>
                <script src='../Calculation.js' async/>
                <script src='../jquery-1.js' async/>
                <script src='https://code.jquery.com/jquery-3.6.4.min.js' async/>
                <meta name="description" content="Skyrocket your presentation for gate exam" />
                <meta name="keywords" content="gate, set2score, engineering" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <section>
                <div id="keyPad" className={`${styles.calc_container} ${styles.keyPad}`}>
                    {/* new Help changes */}
                    <div id="helptopDiv" className={styles.helptopDiv}>
                        <span>Scientific Calculator</span>
                        <div
                            href="#nogo"
                            id="keyPad_Help"
                            className={`${styles.help_back} ${styles.keyPad_Help}`}
                        >
                            Help
                        </div>
                        <div
                            style={{ display: "none" }}
                            href="#nogo"
                            id="keyPad_Helpback"
                            className={`${styles.help_back} ${styles.keyPad_Helpback}`}
                        >
                            Back
                        </div>
                    </div>
                    
                    {/* new Help changes */}
                    <div className={styles.calc_min} id="calc_min" />

                    <div className="calc_max hide" id="calc_max"></div>
                    <div
                        className={styles.calc_close}
                        id="closeButton"
                        onClick={() => handleClose()}
                    >
                        X
                    </div>

                    {/* main content start here*/}
                    <div id="mainContentArea" className={styles.mainContentArea}>
                        <input
                            id="keyPad_UserInput1"
                            className={`${styles.keyPad_TextBox1} ${'keyPad_TextBox1'}`}
                            readOnly="readonly"
                            type="text"
                        />
                        <div id="text_container" className={styles.text_container}>
                            <input
                                defaultValue={0}
                                id="keyPad_UserInput"
                                className={`${styles.keyPad_TextBox} ${'keyPad_TextBox'}`}
                                maxLength={30}
                                readOnly="readonly"
                                type="text"
                            />
                            <span id="memory" className={styles.memoryhide}>
                                <font size={2}>M</font>
                            </span>
                            <font size={2}></font>
                        </div>
                        <font size={2}>
                            <div className={styles.clear} />
                            <div id="left_sec" className={styles.left_sec}>
                                <div className={`${styles.calc_row} ${styles.clear}`}>
                                    <a href="#nogo" id="keyPad_btnMod" className={`${styles.keyPad_btnBinaryOp} ${'keyPad_btnBinaryOp'}`}>
                                        mod
                                    </a>
                                    <div className={`${styles.degree_radian} ${'degree_radian'}`}>
                                        <input
                                            name="degree_or_radian"
                                            defaultValue="deg"
                                            defaultChecked="checked"
                                            type="radio"
                                        />
                                        Deg
                                        <input
                                            name="degree_or_radian"
                                            defaultValue="rad"
                                            type="radio"
                                        />
                                        Rad
                                    </div>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnPi"
                                        className={`${styles.keyPad_btnConst} ${'keyPad_btnConst'}`}
                                        style={{ visibility: "hidden" }}
                                    >
                                        π
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnE"
                                        className={`${styles.keyPad_btnConst} ${'keyPad_btnConst'}`}
                                        style={{ visibility: "hidden" }}
                                    >
                                        e
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnE"
                                        className={`${styles.keyPad_btnConst} ${'keyPad_btnConst'}`}
                                        style={{ visibility: "hidden" }}
                                    >
                                        e
                                    </a>
                                    <a href="#nogo" id="keyPad_MC" className={`${styles.keyPad_btnMemoryOp} ${'keyPad_btnMemoryOp'}`}>
                                        MC
                                    </a>
                                    <a href="#nogo" id="keyPad_MR" className={`${styles.keyPad_btnMemoryOp} ${'keyPad_btnMemoryOp'}`}>
                                        MR
                                    </a>
                                    <a href="#nogo" id="keyPad_MS" className={`${styles.keyPad_btnMemoryOp} ${'keyPad_btnMemoryOp'}`}>
                                        MS
                                    </a>
                                    <a href="#nogo" id="keyPad_M+" className={`${styles.keyPad_btnMemoryOp} ${'keyPad_btnMemoryOp'}`}>
                                        M+
                                    </a>
                                    <a href="#nogo" id="keyPad_M-" className={`${styles.keyPad_btnMemoryOp} ${'keyPad_btnMemoryOp'}`}>
                                        M-
                                    </a>
                                </div>
                                <div className={`${styles.calc_row} ${styles.clear}`}>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnSinH"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'} ${styles.min}`}
                                    >
                                        sinh
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnCosinH"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'} ${styles.min}`}
                                    >
                                        cosh
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnTgH"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'} ${styles.min}`}
                                    >
                                        tanh
                                    </a>
                                    <a href="#nogo" id="keyPad_EXP" className={`${styles.keyPad_btnBinaryOp} ${'keyPad_btnBinaryOp'}`}>
                                        Exp
                                    </a>
                                    <a href="#nogo" id="keyPad_btnOpen" className={`${styles.keyPad_btnBinaryOp} ${'keyPad_btnBinaryOp'}`}>
                                        (
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnClose"
                                        className={`${styles.keyPad_btnBinaryOp} ${'keyPad_btnBinaryOp'}`}
                                    >
                                        )
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnBack"
                                        className={`${styles.keyPad_btnCommand} ${'keyPad_btnCommand'} ${styles.calc_arrows} ${styles.keyPad_btnBack}`}
                                    >
                                        <div style={{ position: "relative", top: "-3px" }}>
                                            ←
                                        </div>
                                    </a>
                                    <a href="#nogo" id="keyPad_btnAllClr" className={`${styles.keyPad_btnCommand} ${'keyPad_btnCommand'} ${styles.keyPad_btnAllClr}`}>
                                        C
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnInverseSign"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'} ${styles.keyPad_btnInverseSign}`}
                                    >
                                        +/-
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnSquareRoot"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'}`}
                                    >
                                        <div style={{ position: "relative", top: 1 }}>√</div>
                                    </a>
                                </div>
                                <div className={`${styles.calc_row} ${styles.clear}`} style={{ marginTop: 5 }}>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnAsinH"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'} ${styles.min}`}
                                    >
                                        <span className={styles.baseele}>sinh</span>
                                        <span className={styles.superscript}>-1</span>
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnAcosH"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'} ${styles.min}`}
                                    >
                                        <span className={styles.baseele}>cosh</span>
                                        <span className={styles.superscript}>-1</span>
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnAtanH"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'} ${styles.min}`}
                                    >
                                        <span className={styles.baseele}>tanh</span>
                                        <span className={styles.superscript}>-1</span>
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnLogBase2"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'}`}
                                    >
                                        <span className={styles.baseele}>log</span>
                                        <span className={styles.subscript}>2</span>
                                        <span className={styles.baseele}>x</span>
                                    </a>
                                    <a href="#nogo" id="keyPad_btnLn" className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'}`}>
                                        ln
                                    </a>
                                    <a href="#nogo" id="keyPad_btnLg" className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'}`}>
                                        log
                                    </a>
                                    <a href="#nogo" id="keyPad_btn7" className={`${styles.keyPad_btnNumeric} ${"keyPad_btnNumeric"}`}>
                                        7
                                    </a>
                                    <a href="#nogo" id="keyPad_btn8" className={`${styles.keyPad_btnNumeric} ${"keyPad_btnNumeric"}`}>
                                        8
                                    </a>
                                    <a href="#nogo" id="keyPad_btn9" className={`${styles.keyPad_btnNumeric} ${"keyPad_btnNumeric"}`}>
                                        9
                                    </a>
                                    <a href="#nogo" id="keyPad_btnDiv" className={`${styles.keyPad_btnBinaryOp} ${'keyPad_btnBinaryOp'}`}>
                                        /
                                    </a>
                                    <a href="#nogo" id="keyPad_%" className={`${styles.keyPad_btnBinaryOp} ${'keyPad_btnBinaryOp'}`}>
                                        %
                                    </a>
                                </div>
                                <div className={`${styles.calc_row} ${styles.clear}`}>
                                    <a href="#nogo" id="keyPad_btnPi" className={`${styles.keyPad_btnConst} ${'keyPad_btnConst'}`}>
                                        π
                                    </a>
                                    <a href="#nogo" id="keyPad_btnE" className={`${styles.keyPad_btnConst} ${'keyPad_btnConst'}`}>
                                        e
                                    </a>
                                    <a href="#nogo" id="keyPad_btnFact" className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'}`}>
                                        n!
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnYlogX"
                                        className={`${styles.keyPad_btnBinaryOp} ${'keyPad_btnBinaryOp'}`}
                                    >
                                        <span className={styles.baseele}>log</span>
                                        <span className={styles.subscript}>y</span>
                                        <span className={styles.baseele}>x</span>
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnExp"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'} ${styles.keyPad_btnExp}`}
                                    >
                                        <span className={styles.baseele}>e</span>
                                        <span className={styles.superscript}>x</span>
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btn10X"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'}`}
                                    >
                                        <span className={styles.baseele}>10</span>
                                        <span className={styles.superscript}>x</span>
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btn4"
                                        className={`${styles.keyPad_btnNumeric} ${"keyPad_btnNumeric"}`}
                                    >
                                        4
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btn5"
                                        className={`${styles.keyPad_btnNumeric} ${"keyPad_btnNumeric"}`}
                                    >
                                        5
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btn6"
                                        className={`${styles.keyPad_btnNumeric} ${"keyPad_btnNumeric"}`}
                                    >
                                        6
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnMult"
                                        className={`${styles.keyPad_btnBinaryOp} ${'keyPad_btnBinaryOp'}`}
                                    >
                                        <div style={{ position: "relative", top: 3, fontSize: 20 }}>
                                            *
                                        </div>
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnInverse"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'}`}
                                    >
                                        <span className={styles.baseele}>1/x</span>
                                    </a>
                                </div>
                                <div className={`${styles.calc_row} ${styles.clear}`}>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnSin"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'} ${styles.min}`}
                                    >
                                        sin
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnCosin"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'} ${styles.min}`}
                                    >
                                        cos
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnTg"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'} ${styles.min}`}
                                    >
                                        tan
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnYpowX"
                                        className={`${styles.keyPad_btnBinaryOp} ${'keyPad_btnBinaryOp'} ${styles.keyPad_btnYpowX}`}
                                    >
                                        <span className={styles.baseele}>x</span>
                                        <span className={styles.superscript}>y</span>
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnCube"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'} ${styles.keyPad_btnCube}`}
                                    >
                                        <span className={styles.baseele}>x</span>
                                        <span className={styles.superscript}>3</span>
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnSquare"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'} ${styles.keyPad_btnSquare}`}
                                    >
                                        <span className={styles.baseele}>x</span>
                                        <span className={styles.superscript}>2</span>
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btn1"
                                        className={`${styles.keyPad_btnNumeric} ${"keyPad_btnNumeric"}`}
                                    >
                                        1
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btn2"
                                        className={`${styles.keyPad_btnNumeric} ${"keyPad_btnNumeric"}`}
                                    >
                                        2
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btn3"
                                        className={`${styles.keyPad_btnNumeric} ${"keyPad_btnNumeric"}`}
                                    >
                                        3
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnMinus"
                                        className={`${styles.keyPad_btnBinaryOp} ${'keyPad_btnBinaryOp'}`}
                                    >
                                        <div style={{ position: "relative", top: "-1px", fontSize: 20 }}>
                                            -
                                        </div>
                                    </a>
                                </div>
                                <div className={`${styles.calc_row} ${styles.clear}`}>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnAsin"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'} ${styles.min}`}
                                    >
                                        <span className={styles.baseele}>sin</span>
                                        <span className={styles.superscript}>-1</span>
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnAcos"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'} ${styles.min}`}
                                    >
                                        <span className={styles.baseele}>cos</span>
                                        <span className={styles.superscript}>-1</span>
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnAtan"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'} ${styles.min}`}
                                    >
                                        <span className={styles.baseele}>tan</span>
                                        <span className={styles.superscript}>-1</span>
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnYrootX"
                                        className={`${styles.keyPad_btnBinaryOp} ${'keyPad_btnBinaryOp'}`}
                                    >
                                        <span className={styles.superscript} style={{ top: "-8px" }}>
                                            y
                                        </span>
                                        <span
                                            className={styles.baseele}
                                            style={{ fontSize: "1.2em", margin: "-6px 0 0 -9px" }}
                                        >
                                            √x
                                        </span>
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnCubeRoot"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'}`}
                                    >
                                        <font size={3}>∛ </font>
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnAbs"
                                        className={`${styles.keyPad_btnUnaryOp} ${'keyPad_btnUnaryOp'}`}
                                    >
                                        <span className={styles.baseele}>|x|</span>
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btn0"
                                        className={`${styles.keyPad_btnNumeric} ${'keyPad_btnNumeric'} ${styles.keyPad_btn0}`}
                                    >
                                        0
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnDot"
                                        className={`${styles.keyPad_btnNumeric} ${'keyPad_btnNumeric'} ${styles.keyPad_btnDot}`}
                                    >
                                        .
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnPlus"
                                        className={`${styles.keyPad_btnBinaryOp} ${'keyPad_btnBinaryOp'}`}
                                    >
                                        +
                                    </a>
                                    <a
                                        href="#nogo"
                                        id="keyPad_btnEnter"
                                        className={`${styles.keyPad_btnCommand} ${'keyPad_btnCommand'} ${styles.keyPad_btnEnter}`}
                                    >
                                        <div style={{ marginBottom: 2 }}>
                                            =
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className={styles.clear} />

                            {/* new Help changes */}
                            <div
                                id="helpContent"
                                className={styles.helpContent}
                                // onMouseDown="return false"
                                style={{ display: "none" }}
                            >
                                <h3 style={{ textAlign: "center" }}>
                                    <strong>Calculator Instructions</strong>
                                </h3>
                                Allows you to perform basic and complex mathematical operations such
                                as modulus, square root, cube root, trigonometric, exponential,
                                logarithmic, hyperbolic functions, etc.
                                <br /> You can operate the calculator using the buttons provided on
                                screen with your mouse. <br />
                                <br />
                                <h3 style={{ textDecoration: "underline", color: "green" }}>Do&apos;s:</h3>
                                <ul>
                                    <li>
                                        Be sure to press [C] when beginning a new calculation.
                                    </li>
                                    <li>
                                        {" "}
                                        Simply an equation using parenthesis and other mathematical
                                        operators.
                                    </li>
                                    <li>
                                        {" "}
                                        Use the predefined operations such as p (Pi), log, Exp to save
                                        time during calculation.
                                    </li>
                                    <li>
                                        Use memory function for calculating cumulative totals.
                                    </li>
                                    <strong>
                                        [M+]: Will add displayed value to memory.
                                        <br />
                                        [MR]: Will recall the value stored in memory.
                                        <br />
                                        [M-]: Subtracts the displayed value from memory.
                                    </strong>
                                    <li>
                                        {" "}
                                        Be sure select the angle unit (Deg or Rad) before beginning any
                                        calculation.
                                    </li>
                                    <strong>Note: By default angle unit is set as Degree</strong>
                                </ul>
                                <h3>
                                    <span style={{ textDecoration: "underline", color: "red" }}>
                                        Dont&apos;s:
                                    </span>
                                </h3>
                                <ul>
                                    <li>Perform multiple operations together.</li>
                                    <li>Leave parenthesis unbalanced.</li>
                                    <li>
                                        {" "}
                                        Change the angle unit (Deg or Rad) while performing a
                                        calculation..
                                    </li>
                                </ul>
                                <h3>
                                    <span style={{ textDecoration: "underline" }}>Limitations:</span>
                                </h3>
                                <ul>
                                    <li>Keyboard operation is disabled.</li>
                                    <li>
                                        {" "}
                                        The output for a Factorial calculation is precise up to 14 digits.
                                    </li>
                                    <li>
                                        {" "}
                                        The output for Logarithmic and Hyperbolic calculations is precise
                                        up to 5 digits.
                                    </li>
                                    <li>
                                        {" "}
                                        Modulus (mod) operation performed on decimal numbers with 15
                                        digits would not be precise.
                                    </li>
                                    <br />
                                    <strong>
                                        {" "}
                                        Use mod operation only if the number comprises of less than 15
                                        digits i.e. mod operation provides best results for smaller
                                        numbers.
                                    </strong>
                                    <br />
                                    <li>
                                        The range of value supported by the calculator is 10(-323) to
                                        10(308).
                                    </li>
                                </ul>
                                <br />
                                <br />
                            </div>
                            {/* new Help changes */}

                            {/* main content end here*/}
                        </font>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ScientificCalculator;