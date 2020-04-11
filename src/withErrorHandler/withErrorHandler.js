import React, {Component} from 'react';
import Modal from '../components/UI/Modal/Modal'
import Aux from '../hoc/AuxWrap/AuxWrap'
import axiosInstance from '../axios-orders';

const withErrorHandler = (WrappedComponent, axios) => {

    return class extends Component {

        state = {
            error : null
        }

        componentWillMount () {
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState( {
                    error :null
                });
                return req;
            })

            this.resInterceptor = axios.interceptors.response.use(null, error => {
                this.setState( {
                    error :error
                })
            })
        }

        componentWillUnmount() {
            console.log("Will Unmount", this.reqInterceptor, this.resInterceptor);
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.request.eject(this.resInterceptor);
        }

        cancelErrorHandler = () => {
            this.setState ({
                error : null
            });
        }

        render () {
            return (
                <Aux>
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.cancelErrorHandler}
                        > Some Problem.....</Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            )
        }

    }

}

export default withErrorHandler;