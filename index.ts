import lineByLine from 'n-readlines';
import path from 'path';
import webdriver, { By, until } from 'selenium-webdriver';

const driver = new webdriver.Builder().forBrowser('firefox').build();

const login = async () => {
    await driver.get('https://web.whatsapp.com');
    console.log('Esperando 10 segundos pa que se logueen');
    await new Promise(r => setTimeout(r, 10000));
    console.log('Listo');
};

const sendMessage = async (number: string, message: string) => {
    await driver.get(
        `https://web.whatsapp.com/send?phone=${number}&text&app_absent=0`
    );
    const buttonLocator = By.xpath(
        '//*[@id="main"]/footer/div[1]/div[2]/div/div[2]'
    );
    await driver.wait(until.elementLocated(buttonLocator), 15000);
    const input = driver.findElement(buttonLocator);
    await input.sendKeys(message);
    const sendButton = driver.findElement(
        By.xpath('//*[@id="main"]/footer/div[1]/div[3]/button')
    );
    await sendButton.click();
};

async function main() {
    await login();
    const liner = new lineByLine(path.join(__dirname, '../numbers.txt'));
    let line;
    while ((line = liner.next())) {
        const number = line.toString('ascii');
        if (isNaN(+number)) {
            return console.log(`${number} is not number.`);
        }
        await sendMessage(number, 'Hola');
    }
}

main();
