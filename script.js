// Нетривиальная логика: контрольная сумма (Checksum)
// Код формируется из символов A-Z + цифры (опционально)
// Последний символ = checksum предыдущих

function getSymbols(includeDigits) {
    let chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (includeDigits) chars += '23456789'; // исключаем 0,1, I, O
    return chars;
}

function calculateChecksum(str) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i);
    }
    return sum % 26 + 65; // возвращает код символа A-Z
}

function generatePromoCode(length, includeDigits) {
    const chars = getSymbols(includeDigits);
    const charsNoChecksum = chars;
    
    // Генерируем основную часть (на 1 символ короче)
    const mainLength = length - 1;
    let mainPart = '';
    for (let i = 0; i < mainLength; i++) {
        const randomIndex = Math.floor(Math.random() * charsNoChecksum.length);
        mainPart += charsNoChecksum[randomIndex];
    }
    
    // Вычисляем контрольную сумму
    const checksumChar = String.fromCharCode(calculateChecksum(mainPart));
    return mainPart + checksumChar;
}

function validatePromoCode(code, includeDigitsFlag) {
    if (!code || code.length < 2) return false;
    
    const mainPart = code.slice(0, -1);
    const providedChecksum = code.slice(-1);
    const expectedChecksum = String.fromCharCode(calculateChecksum(mainPart));
    
    // Дополнительно проверяем, что все символы допустимы
    const allowedChars = getSymbols(includeDigitsFlag);
    const allValid = code.split('').every(ch => allowedChars.includes(ch));
    
    return allValid && providedChecksum === expectedChecksum;
}

// DOM элементы
const lengthInput = document.getElementById('codeLength');
const digitsCheckbox = document.getElementById('includeDigits');
const generateBtn = document.getElementById('generateBtn');
const generatedCodeSpan = document.getElementById('generatedCode');
const copyBtn = document.getElementById('copyBtn');
const validateInput = document.getElementById('validateInput');
const validateBtn = document.getElementById('validateBtn');
const validationResultDiv = document.getElementById('validationResult');

let currentGeneratedCode = '';

generateBtn.addEventListener('click', () => {
    const length = parseInt(lengthInput.value);
    const includeDigits = digitsCheckbox.checked;
    
    if (length < 4 || length > 20) {
        alert('Длина должна быть от 4 до 20');
        return;
    }
    
    currentGeneratedCode = generatePromoCode(length, includeDigits);
    generatedCodeSpan.textContent = currentGeneratedCode;
    copyBtn.style.display = 'inline-block';
});

copyBtn.addEventListener('click', async () => {
    if (!currentGeneratedCode) return;
    await navigator.clipboard.writeText(currentGeneratedCode);
    copyBtn.textContent = '✓';
    setTimeout(() => { copyBtn.textContent = '📋'; }, 1500);
});

validateBtn.addEventListener('click', () => {
    const code = validateInput.value.trim().toUpperCase();
    if (!code) {
        validationResultDiv.innerHTML = '❌ Введите промокод';
        validationResultDiv.className = '';
        return;
    }
    
    const includeDigits = digitsCheckbox.checked; // используем текущие настройки
    const isValid = validatePromoCode(code, includeDigits);
    
    validationResultDiv.innerHTML = isValid 
        ? '✅ Промокод валидный!' 
        : '❌ Неверный промокод (ошибка контрольной суммы или недопустимые символы)';
    validationResultDiv.className = isValid ? 'valid' : 'invalid';
});

// Простая валидация на ввод в поле проверки
validateInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
});