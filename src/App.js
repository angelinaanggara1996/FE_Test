import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      rates: {},
      currencies: {},
      tables: [],
      value: "10.0000"
    };
  }

  componentDidMount() {
    fetch("https://api.exchangeratesapi.io/latest?base=USD") // data source is an object, not an array.
      .then(res => res.json()) // Short typo for response.
      .then(
        result => {
          this.setState({
            isLoaded: true,
            rates: result.rates
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
    fetch("https://openexchangerates.org/api/currencies.json")
    .then(res => res.json())
    .then(
      result => {
        this.setState({
          isLoaded: true,
          currencies: result
        });
      },
      error => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  }

  addNewRow = () => {
    let addcurr = document.getElementById("addCurrency").value.trim().toUpperCase();
    if (addcurr === ""){
      alert("please input new currency value");
    } else {
      var tbl = document.getElementById(addcurr);
      if(tbl){
        alert(addcurr + " already exists in the table");
      } else {
        this.createNewRow(addcurr);
      }
    }
  };

  createNewRow = (addcurr) => {
    const mystate = this.state;
    let ratesArr = Object.keys(mystate).map(i => mystate[i])[2];
    let currencyKey = Object.keys(mystate).map(i => mystate[i])[3];
    let children=[];
    console.log(children);
    if(ratesArr.hasOwnProperty(addcurr) && currencyKey.hasOwnProperty(addcurr)){
      let exchangeRate = ratesArr[addcurr].toLocaleString(undefined, {maximumFractionDigits:2, minimumFractionDigits:2});
      let exchangeVal = (this.state.value * ratesArr[addcurr]).toLocaleString(undefined, {maximumFractionDigits:2, minimumFractionDigits:2});
      children.push(
        <tr id={addcurr}>
          <td>
            {addcurr}<br></br>
            <p id="desc">{addcurr}-{currencyKey[addcurr]}</p><br></br>
            <p id="desc">1 USD = {addcurr} {exchangeRate}</p><br></br>
          </td>
          <td><input type="text" value={exchangeVal} readOnly></input></td>
          <td><input type="button" onClick={this.handleRemoveRow.bind(this, addcurr)} value="(-)"/></td>
        </tr>
      );
      this.state.tables.push(<table className="ListTable"><tbody>{children}</tbody></table>);
      this.setState({
        tables: this.state.tables
      });
    /*
     let r = "<tr id=" + addcurr +"><td>";
     r += addcurr;
     r += "<br>";
     r = r + "<p id='desc'>" + addcurr + "-" + currencyKey[addcurr] + "</p><br>";
     r = r + "<p id='desc'>1 USD = " + addcurr + " " + exchangeRate + "</p><br>";
     r += "</td>";
     r = r + "<td><input type='text' value=" + exchangeVal + " readOnly></input></td>";
     r = r + "<td><input type='button' value='(-)' id='delete'/></td>";
     r += "</tr>";
     document.getElementById("mytable").getElementsByTagName("tbody")[0].innerHTML += r;
     document.getElementById("delete").onClick = handleRemoveRow(addcurr);
     */
     document.getElementById("addCurrency").value = "";
    }  else{
      alert("Not found " + addcurr);
    }  
  };

  handleAddRow = (event) => {

  };

  handleRemoveRow = (keyid) => {
      var tbl = document.getElementById(keyid);
      tbl.parentNode.removeChild(tbl);
  };

  handleChange = (event) => {
    this.setState({value: event.target.value})
  };

  createTable = () => {
    const mystate = this.state;
    let ratesArr = Object.keys(mystate).map(i => mystate[i])[2];
    let currencyKey = Object.keys(mystate).map(i => mystate[i])[3];
    let displayedCurrencies = ["CAD", "IDR", "GBP", "CHF", "SGD", "INR", "MYR", "JPY", "KRW"];
    let children = [];
    // The following loop is used to create inner structure (children) of the table.
    for (var key in ratesArr) {
      if (ratesArr.hasOwnProperty(key) && displayedCurrencies.includes(key) && currencyKey.hasOwnProperty(key)) {
        let exchangeRate = ratesArr[key].toLocaleString(undefined, {maximumFractionDigits:2, minimumFractionDigits:2});
        let exchangeVal = (this.state.value * ratesArr[key]).toLocaleString(undefined, {maximumFractionDigits:2, minimumFractionDigits:2});
        children.push(
            <tr id={key}>
              <td>
                {key}<br></br>
                <p id="desc">{key}-{currencyKey[key]}</p><br></br>
                <p id="desc">1 USD = {key} {exchangeRate}</p><br></br>
              </td>
              <td><input type="text" value={exchangeVal} readOnly></input></td>
              <td><input type="button" onClick={this.handleRemoveRow.bind(this, key)} value="(-)"/></td>
            </tr>
        );
      }
    }
    this.state.tables.push(<table className="ListTable"><tbody>{children}</tbody></table>);
  };

  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      return <div>Oops: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      this.createTable();
      return (
        <main>
          <div className="App-body">
            <table className="currencyTable">
              <thead>
                <tr>
                  <th><p id="desc">USD-United States Dollars</p><br></br>USD</th>
                  <th><input type="text" id="baseinput" defaultValue={this.state.value} onChange={this.handleChange.bind(this)}></input></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="2">
                    {this.state.tables}
                    <table className="ListTable" id="mytable">
                      <tbody>
                      </tbody>
                    </table>
                    <table className="ListTable">
                      <tbody>
                        <tr>
                          <td colSpan="3" id="afterclick">
                            <input type="text" id="addCurrency" placeholder="Type here.."></input>
                            <input type="button" id="submitbutton" onClick={this.addNewRow.bind(this)} value="Submit"/>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3" id="beforeclick">
                            <input type="button" onClick={this.handleAddRow.bind(this)} value="(+) Add More Currencies"/>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              * base currency is USD
              <br />* As for the API,&nbsp;
              <a href="https://exchangeratesapi.io/">
                https://exchangeratesapi.io/
              </a>
              &nbsp;is used.
            </p>
          </div>
        </main>
      );
    }
  }
}

export default App;
