const { Builder, By } =  require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const noblox = require('noblox.js')
const fs = require('fs');

let option = new chrome.Options().addArguments(`--proxy-server=http://138.185.15.56:999`);
function generate_name(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
  
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function account_gen(){
    const driver = await new Builder()
    .forBrowser('chrome')
    //.setChromeOptions(option)
    .build()
  
  try {
      if(driver.getCurrentUrl() !== "https://www.roblox.com/"){
        console.log('Moving to roblox')
        await driver.get('https://www.roblox.com/');
      }
      const username = await driver.findElement(By.id("signup-username"));
      const password = await driver.findElement(By.id("signup-password"));
      const gender = await driver.findElement(By.id("MaleButton"));
      const birthdayDay = await driver.findElement(By.id("DayDropdown"));
      const birthdayMonth = await driver.findElement(By.id("MonthDropdown"));
      const birthdayYear = await driver.findElement(By.id("YearDropdown"));
      const submit = await driver.findElement(By.id("signup-button"));
      const user = generate_name(10);
      const pass = generate_name(10);
      await username.sendKeys(user);
      await password.sendKeys(pass);
      await birthdayDay.sendKeys("01");
      await birthdayMonth.sendKeys("Jan");
      await birthdayYear.sendKeys("2000");
      await gender.click();
      delay(100);
      await submit.click();
      let attemps = 0;
      while(await driver.getCurrentUrl() !== "https://www.roblox.com/home?nu=true" && attemps < 5){
          await delay(4000)
          console.log(`Attempting to create user ${user} (${pass})`)
          attemps++;
      }

      if(await driver.getCurrentUrl() !== "https://www.roblox.com/home?nu=true"){
          console.log('Failed');
          await driver.quit();
          return;
      }
      const cookie = await driver.manage().getCookie('.ROBLOSECURITY');
      fs.appendFile('cookies.txt', `User: ${user} | Pass: ${pass} | Cookie: ${cookie.value}\n`, function (err) {
        if (err) throw err;
        console.log(`Saved | User: ${user} | Pass: ${pass}`);
      });
      await driver.quit();
    }catch(ex){
        console.log(ex);
    }
}

async function multi_accounts_gen(){
    for(var i = 0; i < 3; i++){
        await account_gen();
        delay(10000);
    }
}
multi_accounts_gen();