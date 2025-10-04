export class Console {
    constructor(outputElement) {
        this.output = outputElement;
    }
    //вывод в консоль
    addMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        this.output.appendChild(messageEl);
        this.output.scrollTop = this.output.scrollHeight;
    }
    //очищаем консоль
    clear() {
        this.output.innerHTML = '';
    }
}