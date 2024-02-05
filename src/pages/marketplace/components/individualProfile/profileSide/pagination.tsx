import React, { useState } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from 'react-feather'

interface propsData {
    page: number;
    setPage: (value: number) => void;
    data: any;
    dataTotalCounter?: any;
    dataPerPage: number;
    handleOnClickDec: () => void;
    handleOnClickInc: () => void;
}

const NabButton = styled.button`
    color: #fff;
    border: 1px solid #FF0071;
    border-radius: 50%;
    padding: 20px;
    position: relative;
    margin: 0 10px;
    background-color: transparent;

    :disabled {
        background-color: #696969de;
    }

    svg { 
        display: flex;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`

const CustomDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 20px;
    margin: 20px auto
`

const NumberInput = styled.input`
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid #ff0071;
    background-color: transparent;
    margin: 0 10px;
    color: #fff;
    text-align: center;
    font-size: 20px;
    outline: none;
`

const PaginationComp = ({ page, setPage, data = [], dataTotalCounter, dataPerPage, handleOnClickInc, handleOnClickDec  }: propsData) => {

    // @ts-ignore
    const cards = parseInt(dataTotalCounter / dataPerPage);
    const count = Number(dataTotalCounter % dataPerPage) ? cards + 1 : cards;

    const [state, setState] = useState<any>()

    const handleChangePage = (event: any) => {
        event.preventDefault();

        if (Number(event.target.value) <= count && Number(event.target.value) >= 1) {
            setPage(Number(event.target.value));
        } else if (Number(event.target.value) > count) {
            setPage(count);
        } else {
            setPage(1);
        }
        setState(null)
    };

    const handleDecrement = () => {
        let dec = Number(page);
        dec--;
        setPage(dec);
        handleOnClickDec()
    }

    const handleIncrement = () => {
        let incr = Number(page);
        incr++;
        setPage(incr);
        handleOnClickInc()
    }

    return (
        <CustomDiv>
            <NabButton disabled={page === 1} onClick={handleDecrement}>
                <ChevronLeft />
            </NabButton>
            <span>Page
                <NumberInput type="number" value={state ?? page} onBlur={handleChangePage}
                    onChange={(e: any) => setState(e.target.value)}
                />
                of {count}</span>
            <NabButton disabled={count === page} onClick={handleIncrement}><ChevronRight /></NabButton>
        </CustomDiv>
    )
}

export default PaginationComp