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
      keys: [],
      value: "10.0000",
      addCurr: false
    };
  }

  //get data from APIs
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

  //UpdateTable
  updateTable = () => {
    const mystate = this.state;
    let ratesArr = Object.keys(mystate).map(i => mystate[i])[2];
    let currencyKey = Object.keys(mystate).map(i => mystate[i])[3];
    let table = [];
    let children=[];
    let keys = this.state.keys.map((i) => {
          return i.addcurr;
        }
    );

    for (let i=0, j=keys; i < keys.length; i++) {
        let addcurr = j[i];
        if (ratesArr.hasOwnProperty(addcurr) && currencyKey.hasOwnProperty(addcurr)) {
          let exchangeRate = ratesArr[addcurr].toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          });
          let exchangeVal = (this.state.value * ratesArr[addcurr]).toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          });
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
      } //end if
    } //end for

    table.push(<table className="ListTable">
      <tbody>{children}</tbody>
    </table>);
    console.log({table});

    var tbl = Object.keys(table);
    return tbl.map(i => {
      return <div>{table[i]}</div>
    });
  };

  //Add new row
  addNewRow = () => {
    this.setState({addCurr: false});
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
    if(ratesArr.hasOwnProperty(addcurr) && currencyKey.hasOwnProperty(addcurr)){
      this.state.keys.push({addcurr});
      this.setState({
        keys: this.state.keys
      });
     document.getElementById("addCurrency").value = "";
    }  else{
      alert("Not found " + addcurr);
    }
  };

  handleAddRow = (event) => {
    this.setState({addCurr: true});
  };

  handleRemoveRow = (keyid) => {
      var tbl = document.getElementById(keyid);
      tbl.parentNode.removeChild(tbl);
  };

  handleChange = (event) => {
    this.setState({value: event.target.value});
  };

  defaultTable = () => {
    const mystate = this.state;
    let ratesArr = Object.keys(mystate).map(i => mystate[i])[2];
    let currencyKey = Object.keys(mystate).map(i => mystate[i])[3];
    let displayedCurrencies = ["CAD", "IDR", "GBP", "CHF", "SGD", "INR", "MYR", "JPY", "KRW"];
    let table = [];
    let children = [];
    for (var key in ratesArr) {
      if (ratesArr.hasOwnProperty(key) && displayedCurrencies.includes(key) && currencyKey.hasOwnProperty(key)) {
        let exchangeRate = ratesArr[key].toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        });
        let exchangeVal = (this.state.value * ratesArr[key]).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        });
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
      }//end if
    }// end for
    table.push(<table className="ListTable">
      <tbody>{children}</tbody>
    </table>);
    return table;
  };

  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      return <div>Oops: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
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
                    {this.defaultTable()}
                    {this.updateTable()}
                    <table className="ListTable" id="mytable">
                      <tbody>
                      </tbody>
                    </table>
                    <table className="ListTable">
                      <tbody>
                          <tr>
                            <td colSpan="3">
                              {this.state.addCurr ? <div><input type="text" id="addCurrency" placeholder="Type here.."></input>
                                    <input type = "button" id="submitbutton" onClick={this.addNewRow.bind(this)} value="Submit"/></div>
                                :  <input type="button" onClick={this.handleAddRow.bind(this)} value="(+) Add More Currencies"/>
                              }
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