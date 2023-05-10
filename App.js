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
    const _screen = number1 + operator + number2;
    setScreen(_screen);
  },[number1, number2, operator]);

  const handlerScreen = useCallback((value) => {
    const lastCharacter = parseInt(screen.slice(-1));
    const currentNumber = number;
    const isResultState = screenState === State.result;
    if (validarCaractere(value, lastCharacter, currentNumber, isResultState)) {
      var newScreen = screen;
      let newState = handlerScreenState(value);
      let newNumber1 = number1;
      var newCurrentNumber = currentNumber + value;
      if (isResultState) {
        newScreen = '';
        newNumber1 = '';
        newCurrentNumber = '' + value;
        resetFields();
      }
      switch (newState) {
        case State.number1:
          setNumber1(newNumber1 + value);
          break;
        case State.number2:
          setNumber2(number2 + value);
          break;
        case State.operator:
          setOperator(value);
          newCurrentNumber = '';
          break;
      }
      setNumber(newCurrentNumber);
      //setScreen(newScreen + value);
      setScreenState(newState);
    }
  }, [screen, screenState, number1, number2, number, operator, resetFields, handlerScreenState]);

  const validarCaractere = (value, lastCharacter, currentNumber, isResultState) => {
    if (value === 0 && !existNumber(currentNumber)) {
      return false;
    }
    if (value === '.' && currentNumber.includes('.')) {
      return false;
    }
    if (screen.length >= 9) {
      return false;
    }
    if (!Number.isInteger(value) && (!Number.isInteger(lastCharacter) || isResultState)) {
      return false;
    }
    return true;
  };

  const resetFields = () => {
    setScreen('');
    setScreen2('');
    setNumber1('');
    setNumber2('');
    setOperator('');
  };

  const calcular = useCallback(() => {
    let result = 0;
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
    console.log(screen);
    setScreen2(screen);
    setScreen(resultToScreen);
    setScreenState(State.result);
  }, [operator, number1, number2, screen]);

  const somar = (value1, value2) => { return parseFloat(value1) + parseFloat(value2) }
  const subtrair = (value1, value2) => { return parseFloat(value1) - parseFloat(value2) }
  const multiplicar = (value1, value2) => { return parseFloat(value1) * parseFloat(value2) }
  const dividir = (value1, value2) => { return parseFloat(value1) / parseFloat(value2) }

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
      //setScreen(screen.slice(0, -1));
      switch (screenState) {
        case State.number1:
          console.log(number1);
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
      //setScreen(_number1);
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
            {screen}
          </Text>
        </View>
      </View>
      <View style={styles.keyboard}>
        <View style={styles.rows}>
          <KeyboardButton
            title={"AC"}
            stylesCustom={styles.textCyan}
            onClickHandler={() => { console.log('teste') }}
          />
          <KeyboardButton
            title={<>
              <Text style={[styles.text, { color: "cyan", position: 'absolute', top: '10%', left: '25%' }]}>+</Text>
              <Text style={[styles.text, { color: "cyan" }]}>/</Text>
              <Text style={[styles.text, { color: "cyan", position: 'absolute', bottom: '10%', right: '25%' }]}>-</Text></>}
            onClickHandler={() => changeNumberSign()}
            disabled={screenState !== State.number1 && screenState !== State.number2}
          />
          <View style={styles.button}>
            <Text style={[styles.text, { color: "cyan" }]}>%</Text>
          </View>
          <KeyboardButton
            title={'/'}
            stylesCustom={styles.textRed}
            onClickHandler={() => handlerScreen(Operator.dividir)}
          />
        </View>
        <View style={styles.rows}>
          <KeyboardButton
            title={7}
            onClickHandler={() => handlerScreen(7)}
          />
          <KeyboardButton
            title={8}
            onClickHandler={() => handlerScreen(8)}
          />
          <KeyboardButton
            title={9}
            onClickHandler={() => handlerScreen(9)}
          />
          <KeyboardButton
            title={'x'}
            stylesCustom={styles.textRed}
            onClickHandler={() => handlerScreen(Operator.multiplicar)}
          />
        </View>
        <View style={styles.rows}>
          <KeyboardButton
            title={4}
            onClickHandler={() => handlerScreen(4)}
          />
          <KeyboardButton
            title={5}
            onClickHandler={() => handlerScreen(5)}
          />
          <KeyboardButton
            title={6}
            onClickHandler={() => handlerScreen(6)}
          />
          <KeyboardButton
            title={'-'}
            stylesCustom={styles.textRed}
            onClickHandler={() => handlerScreen(Operator.subtrair)}
          />
        </View>
        <View style={styles.rows}>
          <KeyboardButton
            title={1}
            onClickHandler={() => handlerScreen(1)}
          />
          <KeyboardButton
            title={2}
            onClickHandler={() => handlerScreen(2)}
          />
          <KeyboardButton
            title={3}
            onClickHandler={() => handlerScreen(3)}
          />
          <KeyboardButton
            title={'+'}
            stylesCustom={styles.textRed}
            onClickHandler={() => handlerScreen(Operator.somar)}
          />
        </View>
        <View style={styles.rows}>
          <KeyboardButton
            title={<MaterialCommunityIcons name="restore" size={24} color="white" />}
            onClickHandler={() => deleteLastCharacter()}
          />
          <KeyboardButton
            title={0}
            onClickHandler={() => handlerScreen(0)}
          />
          <KeyboardButton
            title={'.'}
            onClickHandler={() => handlerScreen('.')} />
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