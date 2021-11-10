import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit {
  public title: string = 'Calculator';
  input: string = '';
  result: string = '';
  public resultList: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.resultList = this.getData();
  }

  // localStorage
  public saveData(value: string): void {
    localStorage.setItem('calc', value);
  }

  getData(): string[] {
    return JSON.parse(localStorage.getItem('calc') || '[]');
  }

  clearData() {
    localStorage.clear();
  }

  // number operations
  pressNum(num: string) {
    //Do Not Allow . more than once
    if (num == '.') {
      if (this.input != '') {
        const lastNum = this.getLastOperand();
        if (lastNum.lastIndexOf('.') >= 0) return;
      }
    }

    //Do Not Allow 0 at beginning.
    if (num === '0') {
      if (this.input === '') {
        return;
      }
      const prevKey = this.input[this.input.length - 1];
      if (
        prevKey === '/' ||
        prevKey === '*' ||
        prevKey === '-' ||
        prevKey === '+'
      ) {
        return;
      }
    }

    this.input = this.input + num;

    this.calcAnswer();
    this.getData();
  }

  getLastOperand() {
    let pos: number;

    pos = this.input.toString().lastIndexOf('+');
    if (this.input.toString().lastIndexOf('-') > pos)
      pos = this.input.lastIndexOf('-');
    if (this.input.toString().lastIndexOf('*') > pos)
      pos = this.input.lastIndexOf('*');
    if (this.input.toString().lastIndexOf('/') > pos)
      pos = this.input.lastIndexOf('/');

    return this.input.substring(pos + 1);
  }

  pressOperator(operator: string) {
    //Do not allow operators more than once
    const lastKey = this.input[this.input.length - 1];
    if (
      lastKey === '/' ||
      lastKey === '*' ||
      lastKey === '-' ||
      lastKey === '+'
    ) {
      return;
    }

    this.input = this.input + operator;
    this.calcAnswer();
  }

  clear() {
    if (this.input != '') {
      this.input = this.input.slice(0, this.input.length - 1);
    }
  }

  allClear() {
    this.result = '';
    this.input = '';
    this.clearData();
  }

  calcAnswer() {
    let resultAnswer = this.input;

    let lastKey = resultAnswer[resultAnswer.length - 1];

    if (lastKey === '.') {
      resultAnswer = resultAnswer.substr(0, resultAnswer.length - 1);
    }

    lastKey = resultAnswer[resultAnswer.length - 1];

    if (
      lastKey === '/' ||
      lastKey === '*' ||
      lastKey === '-' ||
      lastKey === '+' ||
      lastKey === '.'
    ) {
      resultAnswer = resultAnswer.substr(0, resultAnswer.length - 1);
    }

    this.result = eval(resultAnswer);
  }

  getAnswer() {
    this.calcAnswer();
    this.input = this.result;
    if (this.input == '0') {
      this.input = '';
    }
    this.resultList.push(this.result.toString());
    this.saveData(JSON.stringify(this.resultList));
  }

  clearResults() {
    this.resultList = [];
    this.result = '';
    this.input = '';
    this.clearData();
  }
}
