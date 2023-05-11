import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import KeyboardButton from './components/KeyboardButton';
import { Operator, State } from './enums/index';

export default function App() {
  const [screen, setScreen] = useState('');
  const [screen2, setScreen2] = useState('');
  const [number, setNumber] = useState('');
  const [screenState, setScreenState] = useState(State.number1);
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [operator, setOperator] = useState('');

  useEffect(() => {
    const _number2 = number2.includes('-') ? ("(" + number2 + ")") : number2;
    const screenUpdated = number1 + operator + _number2;
    setScreen(screenUpdated);
  }, [number1, number2, operator]);

  const handlerOperatorScreen = useCallback((value) => {
    const lastCharacter = parseInt(screen.slice(-1));
    const isValid = validarOperator(lastCharacter);
    if (isValid) {
      const isValidCalculo = validarCalculo(number1, number2, operator);
      if (isValidCalculo) {
        calcular();
      }
      setOperator(value);
      setScreenState(State.operator);
      setNumber('');
      setScreen2('');
      return;
    }
    if (screenState === State.operator) {
      setOperator(value);
    }
  }, [screen, screenState, number1, number2, operator, calcular, validarOperator])

  const handlerNumberScreen = useCallback((value) => {
    const lastCharacter = parseInt(screen.slice(-1));
    const currentNumber = number;
    const isResultState = screenState === State.result;
    const isValid = validarCaractere(value, lastCharacter, currentNumber, isResultState);
    if (isValid) {
      let newState = handlerScreenState(value);
      let newNumber1 = number1 + value;
      let newNumber2 = number2 + value;
      var newCurrentNumber = currentNumber + value;
      switch (newState) {
        case State.number1:
          setNumber1(newNumber1);
          break;
        case State.number2:
          setNumber2(newNumber2);
          break;
      }
      setNumber(newCurrentNumber);
      setScreenState(newState);
    }
  }, [screen, screenState, number1, number2, number, operator, resetFields, handlerScreenState]);

  const validarCaractere = (value, lastCharacter, currentNumber, isResultState) => {
    if (value === 0 && parseInt(lastCharacter) === 0 && currentNumber === '0') {
      return false;
    }
    if (value === '.' && currentNumber.includes('.')) {
      return false;
    }
    if (screen.length >= 9) {
      return false;
    }
    if (!Number.isInteger(value)) {
      return validarOperator(lastCharacter, isResultState);
    }
    return true;
  };

  const validarOperator = (lastCharacter) => {
    if (!Number.isInteger(lastCharacter)) {
      return false;
    }
    return true;
  }

  const resetFields = () => {
    setNumber1('');
    setNumber2('');
    setNumber('');
    setOperator('');
    setScreen2('');
    setScreenState(State.number1);
  };

  const validarCalculo = (number1, number2, operator) => {
    if (number1 === 0 || number1 === '' || !existNumber(number1)) {
      return false;
    }
    if (number2 === 0 || number2 === '' || !existNumber(number2)) {
      return false;
    }
    if (operator === '' || !existNumber(operator)) {
      return false;
    }
    if (operator === Operator.dividir && parseFloat(number2) === 0) {
      return false;
    }
    return true;
  };

  const calcular = useCallback(() => {
    let result = 0;
    if (screenState !== State.result && validarCalculo(number1, number2, operator)) {
      switch (operator) {
        case Operator.somar:
          result = somar(number1, number2);
          break;
        case Operator.subtrair:
          result = subtrair(number1, number2);
          break;
        case Operator.multiplicar:
          result = multiplicar(number1, number2);
          break;
        case Operator.dividir:
          result = dividir(number1, number2);
          break;
      }
      const resultToScreen = Number.isInteger(result) ? result.toString() : result.toFixed(2).toString();
      resetFields();
      setScreen2(screen);
      setNumber1(resultToScreen);
      setNumber(resultToScreen);
      return resultToScreen;
    }
  }, [operator, number1, number2, screen]);

  const somar = (value1, value2) => { return parseFloat(value1) + parseFloat(value2) }
  const subtrair = (value1, value2) => { return parseFloat(value1) - parseFloat(value2) }
  const multiplicar = (value1, value2) => { return parseFloat(value1) * parseFloat(value2) }
  const dividir = (value1, value2) => { return parseFloat(value1) / parseFloat(value2) }

  const porcentagem = useCallback(() => {
    const lastCharacter = parseInt(screen.slice(-1));
    const isValid = validarOperator(lastCharacter);
    if (isValid) {
      let newNumber1 = number1;
      const isValidCalculo = validarCalculo(number1, number2, operator);
      if (isValidCalculo) {
        newNumber1 = calcular();
      }
      let result = parseFloat(newNumber1) / 100;
      const resultToScreen = Number.isInteger(result) ? result.toString() : result.toFixed(2).toString();
      resetFields();
      setNumber1(resultToScreen);
      setNumber(resultToScreen);
    }
  }, [number1, number2, screen, calcular]);

  const handlerScreenState = useCallback((value) => {
    var _state = screenState;
    if (!Number.isInteger(value) && value !== '.') {
      _state = State.operator;
    } else {
      if (screenState === State.operator) {
        _state = State.number2;
      }
      if (screenState === State.result) {
        _state = State.number1;
      }
    }
    return _state;
  }, [screenState]);

  const deleteLastCharacter = useCallback(() => {
    const isResultState = screenState == State.result;
    if (!isResultState) {
      switch (screenState) {
        case State.number1:
          setNumber1(number1.slice(0, -1));
          break;
        case State.number2:
          setNumber2(number2.slice(0, -1));
          break;
        case State.operator:
          setOperator('');
          setScreenState(State.number1);
          break;
      }
    }
  }, [screen, screenState, setScreenState, number1, number2]);

  const changeNumberSign = useCallback(() => {
    if (existNumber(number2)) {
      var _number2 = changeNumber(number2);
      setNumber2(_number2);
      setNumber(_number2);
    }
    if (existNumber(operator)) {
      return;
    }
    if (existNumber(number1)) {
      var _number1 = changeNumber(number1);
      setNumber1(_number1);
      setNumber(_number1);
    }
  }, [number1, number2, operator]);

  const changeNumber = (number) => {
    const _number = Math.sign(number) === -1 ? Math.abs(number) : (- number);
    return _number.toString();
  };

  const existNumber = (value) => {
    return value !== 0 && value !== undefined && value !== '';
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        <View style={[styles.rows, { flex: 7, alignItems: 'flex-end' }]}>
          <Text style={[styles.text, { marginRight: 10, letterSpacing: 3 }]}>
            {screen2}
          </Text>
        </View>
        <View style={[styles.rows, { flex: 3 }]}>
          <Text style={[styles.text, { marginRight: 10, fontSize: 60, fontWeight: "bold", letterSpacing: 5 }]}>
            {number1}
          </Text>
          <Text style={[styles.textRed, { marginRight: 10, fontSize: 60, fontWeight: "bold", letterSpacing: 5 }]}>
            {operator}
          </Text>
          <Text style={[styles.text, { marginRight: 10, fontSize: 60, fontWeight: "bold", letterSpacing: 5 }]}>
            {number2.includes('-') ? ("(" + number2 + ")") : number2}
          </Text>
        </View>
      </View>
      <View style={styles.keyboard}>
        <View style={styles.rows}>
          <KeyboardButton
            title={screen === '' ? "AC" : "C"}
            stylesCustom={styles.textCyan}
            onClickHandler={() => { resetFields() }}
            disabled={screen === ''}
          />
          <KeyboardButton
            title={<>
              <Text style={[styles.text, { color: "cyan", position: 'absolute', top: '10%', left: '25%' }]}>+</Text>
              <Text style={[styles.text, { color: "cyan" }]}>/</Text>
              <Text style={[styles.text, { color: "cyan", position: 'absolute', bottom: '10%', right: '25%' }]}>-</Text></>}
            onClickHandler={() => changeNumberSign()}
            disabled={screenState !== State.number1 && screenState !== State.number2}
          />
          <KeyboardButton
            title={Operator.porcentagem}
            stylesCustom={styles.textCyan}
            onClickHandler={() => { porcentagem() }}
          />
          <KeyboardButton
            title={'/'}
            stylesCustom={styles.textRed}
            onClickHandler={() => handlerOperatorScreen(Operator.dividir)}
          />
        </View>
        <View style={styles.rows}>
          <KeyboardButton
            title={7}
            onClickHandler={() => handlerNumberScreen(7)}
          />
          <KeyboardButton
            title={8}
            onClickHandler={() => handlerNumberScreen(8)}
          />
          <KeyboardButton
            title={9}
            onClickHandler={() => handlerNumberScreen(9)}
          />
          <KeyboardButton
            title={'x'}
            stylesCustom={styles.textRed}
            onClickHandler={() => handlerOperatorScreen(Operator.multiplicar)}
          />
        </View>
        <View style={styles.rows}>
          <KeyboardButton
            title={4}
            onClickHandler={() => handlerNumberScreen(4)}
          />
          <KeyboardButton
            title={5}
            onClickHandler={() => handlerNumberScreen(5)}
          />
          <KeyboardButton
            title={6}
            onClickHandler={() => handlerNumberScreen(6)}
          />
          <KeyboardButton
            title={'-'}
            stylesCustom={styles.textRed}
            onClickHandler={() => handlerOperatorScreen(Operator.subtrair)}
          />
        </View>
        <View style={styles.rows}>
          <KeyboardButton
            title={1}
            onClickHandler={() => handlerNumberScreen(1)}
          />
          <KeyboardButton
            title={2}
            onClickHandler={() => handlerNumberScreen(2)}
          />
          <KeyboardButton
            title={3}
            onClickHandler={() => handlerNumberScreen(3)}
          />
          <KeyboardButton
            title={'+'}
            stylesCustom={styles.textRed}
            onClickHandler={() => handlerOperatorScreen(Operator.somar)}
          />
        </View>
        <View style={styles.rows}>
          <KeyboardButton
            title={<MaterialCommunityIcons name="restore" size={24} color="white" />}
            onClickHandler={() => deleteLastCharacter()}
          />
          <KeyboardButton
            title={0}
            onClickHandler={() => handlerNumberScreen(0)}
          />
          <KeyboardButton
            title={'.'}
            onClickHandler={() => handlerNumberScreen('.')} />
          <KeyboardButton
            title={'='}
            stylesCustom={styles.textRed}
            onClickHandler={() => calcular()} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#22252D",
  },
  screen: {
    flex: 4,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 20,
    paddingRight: 25,
    marginRight: 6,
  },
  keyboard: {
    flex: 6,
    justifyContent: "space-between",
    backgroundColor: "#292d36",
    padding: 20,
    marginTop: 10,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },
  rows: {
    flexDirection: 'row',
    flex: 1,
    padding: 2,
    alignItems: 'stretch',
  },
  button: {
    backgroundColor: "#22252D",
    borderRadius: 10,
    margin: 6,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 28,
    color: "white",
  },
  textCyan: {
    color: "cyan",
  },
  textRed: {
    color: "red",
  },
});