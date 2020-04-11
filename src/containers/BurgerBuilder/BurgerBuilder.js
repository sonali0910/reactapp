import React, { Component } from 'react';

import Aux from '../../hoc/AuxWrap/AuxWrap';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders'
import axiosInstance from '../../axios-orders';
import Spinner from '../../components/Spinner/Spinner';
import withErrorHandler from '../../withErrorHandler/withErrorHandler';
import Axios from 'axios';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        ingredients: null,
            // salad: 0,
            // bacon: 0,
            // cheese: 0,
            // meat: 0
       // },
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading : false
    }

    updatePurchaseState (ingredients) {
        const sum = Object.keys( ingredients )
            .map( igKey => {
                return ingredients[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        this.setState( { purchasable: sum > 0 } );
    }

    addIngredientHandler = ( type ) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = ( type ) => {
        const oldCount = this.state.ingredients[type];
        if ( oldCount <= 0 ) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        //alert('You continue!');
        this.setState({loading:true});
        const order  = {
            ingredients :  this.state.ingredients,
            price : this.state.totalPrice,
            customer : {
                name: 'Sonali',
                age : 32,
                gender :'F'
            }
        }

        axios.post('/orders.json', order)
        .then(response => {
            console.log(response.data);
            this.setState({purchasing: false,
                loading:false});
        }).catch(error => {
            this.setState({purchasing: false,
                loading:false});
            //console.log(error)
        })

    }

    componentDidMount() {
        axios.get('/ingredients.json')
        .then(response => {
            this.setState({ingredients: response.data})
            console.log(response.data);
           // this.setState({purchasing: false,
             //   loading:false});
        }).catch(error => {
            //this.setState({purchasing: false,
               // loading:false});
               this.setState({error:true})
            console.log(error);
        })
    }


    render () {
        const disabledInfo = {
            ...this.state.ingredients
        };
        let orderSummary;
        if(this.state.ingredients) {
            orderSummary = <OrderSummary 
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler} />
        }

        if(this.state.loading) {
            orderSummary = <Spinner />
        }    

        let burgerIngredients =  this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;
        
        if(this.state.ingredients) { 
        burgerIngredients = <Aux>
            <Burger ingredients={this.state.ingredients} /><BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
            price={this.state.totalPrice} />
            </Aux>;
        }

        
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        // {salad: true, meat: false, ...}
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                  {orderSummary} 
                  
                </Modal>
                {burgerIngredients}                
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);