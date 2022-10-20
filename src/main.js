import "./css/index.css"
import IMask from 'imask';

const ccBgColor01 = document.querySelector('.cc-bg svg > g g:nth-child(1) path')
const ccBgColor02 = document.querySelector('.cc-bg svg > g g:nth-child(2) path')
const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img')




function setTypeCard(type){

      
    const colors = {
        visa: ['#436D99', '#2D57F2'],
        mastercard :['DF6F29', '#C69347'],
        default: ['black', 'gray']
    }

    ccBgColor01.setAttribute("fill", colors[type][0])
    ccBgColor02.setAttribute("fill", colors[type][1])
    ccLogo.setAttribute('src', `cc-${type}.svg`)
    
}

globalThis.setTypeCard = setTypeCard


const securityCode = document.querySelector( '#security-code' )

const securityCodePattern = { mask:'0000' }
const securityCodeMasked = IMask(securityCode, securityCodePattern)


const expirationDate = document.querySelector('#expiration-date')

const expirationDatePattern = { 
    mask:`MM{/}YY`, 
    blocks:{ 
        
        MM: {
        mask: IMask.MaskedRange, 
        from: 1, 
        to: 12
        },
        YY:{
        mask: IMask.MaskedRange ,
        from: String(new Date().getFullYear()).slice(2) ,
        to: String(new Date().getFullYear() + 10).slice(2)
        }
    }}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector('#card-number')
const cardNumberPattern = {
    mask:  [
        {
            mask: '0000 0000 0000 0000',
            regex:/^4\d{0,15}/,
            cardType: 'visa'
        },
        {
            mask: '0000 0000 0000 0000',
            regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3,7]\d{0,2})\d{0,12}/,
            cardType: 'mastercard'
        },
        {
            mask: '0000 0000 0000 0000',
            cardType: 'default'
        }
    ],
    dispatch: function(appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, '')
        const foundMask = dynamicMasked.compiledMasks.find(({regex}) => number.match(regex))
      
        return foundMask
    }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const cardHolder = document.querySelector('#card-holder')   
cardHolder.addEventListener('input', () => {
    const ccHolder = document.querySelector('.cc-holder .value')
    ccHolder.innerHTML =  cardHolder.value.length > 0 ? cardHolder.value : 'FULANO DA SILVA'
})

const addButton = document.querySelector('#btn-add-card')

addButton.addEventListener('click', 
    e => { 
    e.target.parentNode.addEventListener('submit', 
    e => e.preventDefault()), 
    alert('Cartão adicionado')
    })


securityCodeMasked.on('accept',() => { 

    const ccSecurity = document.querySelector('.cc-security .value')
    ccSecurity.innerHTML = securityCodeMasked.value.length > 0 ? securityCodeMasked.value : '123'
   
})

expirationDateMasked.on('accept',() => {

    const ccExpires = document.querySelector('.cc-expiration .value')
    ccExpires.innerHTML = expirationDateMasked.value.length > 0 ? expirationDateMasked.value : '02/32'
})

cardNumberMasked.on('accept',() => {
    const cardType = cardNumberMasked.masked.currentMask.cardType
    setTypeCard(cardType)

    const ccNumber = document.querySelector('.cc-number')    
    ccNumber.innerHTML = cardNumberMasked.value.length > 0 ? cardNumberMasked.value : '1234 5678 9012 3456'
})

    
