import lineByLine from 'n-readlines';
import path from 'path';
import webdriver, { By, until } from 'selenium-webdriver';

const driver = new webdriver.Builder().forBrowser('firefox').build();

const mensaje = 'Soy un mensaje automático. Hola.';

const login = async () => {
    await driver.get('https://web.whatsapp.com');
    console.log('Esperando pa que se logueen');
    const contactButtonLocator = By.xpath(
        '//*[@id="side"]/header/div[2]/div/span/div[2]/div'
    );
    await driver.wait(until.elementLocated(contactButtonLocator), 15000);
    console.log('Listo');
};

const sendMessage = async (number: string, message: string) => {
    await driver.get(
        `https://web.whatsapp.com/send?phone=${number}&text&app_absent=0`
    );
    const inputLocator = By.xpath(
        '//*[@id="main"]/footer/div[1]/div[2]/div/div[2]'
    );
    await driver.wait(until.elementLocated(inputLocator), 15000);
    const input = driver.findElement(inputLocator);
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
        await sendMessage(number, mensaje);
    }
}

main();
