import * as React from "react";
import styled from "styled-components";

import Panel from "./Panel";
import History from "./History";
import Display from "./Display";
import ButtonGroup from "./ButtonGroup";
import Button from "./Button";

const Container = styled.div`
  margin: 30px auto;
  text-align: center;
`;

// TODO: History 내에서 수식 표시할 때 사용
const Box = styled.div`
  display: inline-block;
  width: 270px;
  height: 65px;
  padding: 10px;
  border: 2px solid #000;
  border-radius: 5px;
  text-align: right;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
  cursor: pointer;
  h3 {
    margin: 0px;
  }
`;

const evalFunc = function (string) {
  string = string.replace(/×/gi, "*"); // 식에 있는 모든 ×를 *로 변환
  string = string.replace(/÷/gi, "/"); // 식에 있는 모든 ÷를 /로 변환
  if(string.substring(0,1) == '√'){ // 히스토리에 '√'가 있으면
    string = string.substring(1,string.length); // '√' 제거
    string = Math.sqrt(evalFunc(string)); // 새로 제곱근 계산해서 저장
  }
  // eslint-disable-next-line no-new-func
  return new Function("return (" + string + ")")();
};

class Calculator extends React.Component {
  // TODO: history 추가
  state = {
    displayValue: "",
    history: [], // history 배열 생성
  };

  onClickButton = key => {
    let { displayValue = "" } = this.state;
    displayValue = "" + displayValue;
    const lastChar = displayValue.substr(displayValue.length - 1);
    const operatorKeys = ["÷", "×", "-", "+"];
    const proc = {
      AC: () => {
        this.setState({ displayValue: "" });
      },
      BS: () => {
        if (displayValue.length > 0) {
          displayValue = displayValue.substr(0, displayValue.length - 1);
        }
        this.setState({ displayValue });
      },
      // TODO: 제곱근 구현
      "√": () => {
        if (lastChar !== "" && operatorKeys.includes(lastChar)) {
          displayValue = displayValue.substr(0, displayValue.length - 1);
        } else if (lastChar !== "") {
          displayValue = Math.sqrt(evalFunc(displayValue));
        }
        // 새로운 배열을 생성해 history에 집어넣는 것이 아닌 배열에 앞에 값 추가 
        this.state.history.unshift({ id: '√(' + this.state.displayValue + ')', value: displayValue });
        this.setState({ displayValue });
      },
      // TODO: 사칙연산 구현
      "÷": () => {
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "÷" });
        }
      },
      "×": () => {
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "×" });
        }
      },
      "-": () => {
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "-" });
        }
      },
      "+": () => {
        // + 연산 참고하여 연산 구현
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "+" });
        }
      },
      "=": () => {
        if (lastChar !== "" && operatorKeys.includes(lastChar)) {
          displayValue = displayValue.substr(0, displayValue.length - 1);
        } else if (lastChar !== "") {
          displayValue = evalFunc(displayValue);
        }
        /*const newList = [ //  식, 결과 값, 이전 식을 저장하는 새로운 배열 생성(id는 식, value는 결과 값)
          { id: this.state.displayValue, value: displayValue },
          ...this.state.history,
        ];
        this.setState({ history: newList }); // history 배열에 저장.
        */
       // 새로운 배열을 생성해 history에 집어넣는 것이 아닌 배열에 앞에 값 추가 
        this.state.history.unshift({ id: this.state.displayValue, value: displayValue });
        this.setState({ displayValue });


      },
      ".": () => {
        if (this.state.displayValue.indexOf(".") === -1) { // .이 있는지 확인
          this.setState({ displayValue: this.state.displayValue + "." }); // 없으면 .추가
        }
      },
      "0": () => {
        if (Number(displayValue) !== 0) {
          displayValue += "0";
          this.setState({ displayValue });
        }
      }
    };

    if (proc[key]) {
      proc[key]();
    } else {
      // 여긴 숫자
      this.setState({ displayValue: displayValue + key });
    }
  };

  handleClick = (i) => { // 히스토리 클릭시 발생하는 이벤트
    {
      this.state.displayValue = i.id; // 식 추출
      this.setState({ displayValue: i.id }) // 디스플레이에 식 출력
    }
  };

  render() {
    return (
      <Container>
        <Panel>
          <Display displayValue={this.state.displayValue} />
          <ButtonGroup onClickButton={this.onClickButton}>
            <Button size={1} color="gray">
              AC
            </Button>
            <Button size={1} color="gray">
              BS
            </Button>
            <Button size={1} color="gray">
              √
            </Button>
            <Button size={1} color="gray">
              ÷
            </Button>

            <Button size={1}>7</Button>
            <Button size={1}>8</Button>
            <Button size={1}>9</Button>
            <Button size={1} color="gray">
              ×
            </Button>

            <Button size={1}>4</Button>
            <Button size={1}>5</Button>
            <Button size={1}>6</Button>
            <Button size={1} color="gray">
              -
            </Button>

            <Button size={1}>1</Button>
            <Button size={1}>2</Button>
            <Button size={1}>3</Button>
            <Button size={1} color="gray">
              +
            </Button>

            <Button size={2}>0</Button>
            <Button size={1}>.</Button>
            <Button size={1} color="gray">
              =
            </Button>
          </ButtonGroup>
        </Panel>
        {/* TODO: History componet를 이용해 map 함수와 Box styled div를 이용해 history 표시 */}
        <History >
          {this.state.history.map((i) => {
            return <Box onClick={() => { this.handleClick(i) }}>
              <h3>{i.id}</h3>
              <h3>= {i.value}</h3>
            </Box>
          })}
        </History>
      </Container>
    );
  }
}

export default Calculator;
