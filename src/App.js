import React, { Component } from 'react'

import {EurekaForm} from 'react-eureka'

import './App.css'
import './css/main.css'
import './css/form.css'
import main from './main'

import cube from './img/ninja.svg'

const Pink = ({children}) => (
  <em className='pink'>{children}</em>
)

class Stepper extends React.PureComponent {
  constructor () {
    super()
    this.state = {
      step: 0
    }
  }

  render () {
    const {children} = this.props
    const {step, args} = this.state

    const clonedChild = React.Children.map(
      children, (child, i) => i === step ? React.cloneElement(child, {
        args,
        next: (...args) => (this.setState({step: step + 1, args: args}))
      }) : null).filter(a => a)

    return (
      <div>
          {clonedChild}
      </div>
    )
  }
}

const Number = ({value}) => (
  <ul className='questions show-next rollingNumber'>
      <li className='next' key={value + 1}>{value + 1}</li>
      <li className='current' key={value}>{value}</li>
      <li className='prev' key={value - 1}>{value - 1}</li>
  </ul>
)

class FormWrapper extends React.Component {
  constructor () {
    super()
    this.state = {
      current: -1,
      values: {}
    }
  }

  render () {
    const {next, ...props} = this.props
    const {values, current, questionsCount} = this.state
    const remaining = <Number value={questionsCount - current - 1} />
    console.error('state', this.state)
    return (
    <div className='flex'>
        <h1 className='caps'>Responda {
          questionsCount - current - 2
          ? <span>estas {remaining} perguntinhas </span>
          : <span>esta ultima preguntinha </span> }
            para que possamos te conhecer melhor e entrar em contato :)
        </h1>
    <EurekaForm id='contact' autoFocus
                onSubmit={next} onUpdate={(state) => this.setState(state)}>
        <span type='name'>Nos diga seu <Pink>nome completo</Pink>:)</span>
        { /* <span type='email'>Oi <Pink>{values.name}</Pink>, agora seu <Pink>email</Pink></span> */}
        <span type='fone'>Oi <Pink>{values.name}</Pink>, agora seu <Pink>Telefone e zap</Pink></span>
        <span type='city'>Qual <Pink>cidade</Pink>, <Pink>estado</Pink>, <Pink>país</Pink> você vive?</span>
        <span type='motivation'>Você quer ser <Pink>ninja</Pink> porque...</span>
        { /* <span type='skills'>E o que você gostaria de<Pink> fazer e colaborar</Pink>?</span> */ }
        <span type='redes'>Manda suas redes <Pink>insta</Pink>, <Pink>face</Pink> e <Pink>twitter</Pink> 8)</span>
        <span type='portfolio'>Compartilha um link do seu <Pink>portifólio</Pink>, <Pink>blog</Pink>, ou <Pink>página</Pink> com seus trabalhos</span>
        { /* <span type='instagram'>Manda seu <Pink>insta</Pink> pra gente colocar no mapa 8)</span> */ }
        <span type='info'>Existe alguma <Pink>informação adicional</Pink> que nos gostaria de registrar?</span>
    </EurekaForm>
    </div>
)
  }
}

const formMapping = {
  name: 'entry.1714540534',
  email: 'entry.1364339574',
  fone: 'entry.719084075',
  city: 'entry.247091769',
  activity: 'entry.1340129654',
  motivation: 'entry.1138207460',
  skills: 'entry.919281481',
  redes: 'entry.1646905508',
  portfolio: 'entry.1718014338',
  instagram: 'entry.1348441891',
  info: 'entry.1545677716'
}

const SendData = ({next, args = [null, {}]}) => {
  const [element, results] = args
  const { name, city, area, email, phone } = results
  const params = Object.keys(results)
                       .map(key => `${formMapping[key]}=${results[key]}`)
                       .join('&')

  console.error('RESULTS', args)
  const url = `https://docs.google.com/forms/d/e/1FAIpQLSc389hSURTyHJu9kU0nhweSL9Jas1cdCd5SyEfGnDWglrFwVQ/viewform?${params}`
  return (
    <div className='flex'>
        <div>
            <h1>Valeu <Pink>{name}</Pink> de <Pink>{city}</Pink>!</h1>
            <button className='desktop pink' onClick={() => window.open(url)}>
                Confirme aqui seu cadastro
            </button>
        </div>
        <div style={{flex: 2}}>
            <img className='cube' src={cube} />
            <h1 className='connected'>Agora estamos conectados ! <br />
                Em breve entramos em contato! Qualquer dúvida entra em contato pelo <Pink><a href="mailto://midianinja@gmail.com">midianinja@gmail.com</a></Pink>.</h1>
                </div>
                <button className='mobile pink' onClick={() => window.open(url)}>
                Confirme aqui seu cadastro
                </button>
                </div>
  )
}

const Details = () => (
  <Stepper>
      <FormWrapper />
      <SendData />
  </Stepper>
)

class App extends Component {
  render () {
    return (

      <div className='App'>
          <div id='hero'>
              <Details />
          </div>

      </div>)
  }
}

export default App
