import { useDispatch, useSelector } from "react-redux";
import { CREDIT_PACKS, PLAN_IDS, pricingList } from "../../config/payments";
import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/config";
import { SET_USER } from "../../redux/user/actions";
import './PurchaseCredit.css';
import { Modal, Button } from "react-bootstrap";

function PurchaseCredit() {
    // --- All existing logic is preserved without changes ---
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.userDetails);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleBuyCredits = async (credits) => {
        setShowModal(false);
        try {
            const { data } = await axios.post(`${serverEndpoint}/api/payments/create-order`, {
                credits
            }, { withCredentials: true });

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'Affiliate++',
                description: `${credits} Credits Pack`,
                order_id: data.order.id,
                handler: async (response) => {
                    try {
                        const { data } = await axios.post(`${serverEndpoint}/api/payments/verify-order`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            credits
                        }, { withCredentials: true });

                        dispatch({
                            type: SET_USER,
                            payload: data
                        });
                        setMessage(`${credits} credits added successfully!`);
                    } catch (error) {
                        console.error(error);
                        setErrors({ message: 'Unable to verify payment. Please contact support.' });
                    }
                },
                theme: { color: '#667eea' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            setErrors({ message: 'Unable to initiate credit purchase. Please try again.' });
        }
    };

    const handleSubscribe = async (planKey) => {
        try {
            const { data } = await axios.post(`${serverEndpoint}/api/payments/create-subscription`, {
                plan_name: planKey
            }, { withCredentials: true });

            const plan = PLAN_IDS[planKey];
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                name: plan.planName,
                description: plan.description,
                subscription_id: data.subscription.id,
                handler: async function (response) {
                    try {
                        const user = await axios.post(`${serverEndpoint}/api/payments/verify-subscription`, {
                            subscription_id: response.razorpay_subscription_id
                        }, { withCredentials: true });

                        dispatch({
                            type: SET_USER,
                            payload: user.data
                        });
                        setMessage('Subscription activated successfully!');
                    } catch (error) {
                        setErrors({ message: 'Unable to activate subscription. Please contact support.' });
                    }
                },
                theme: { color: "#667eea" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            setErrors({ message: 'Failed to create subscription. Please try again.' });
        }
    };
    // --- End of preserved logic ---

    return (
        <div className="pricing-container">
            <div className="container py-5">
                <div className="pricing-header text-center">
                    <h1 className="display-4">Flexible Plans for Everyone</h1>
                    <p className="lead text-muted">Choose the perfect plan to supercharge your affiliate marketing.</p>
                    <div className="current-balance-container mt-4">
                        Your Current Balance: <strong>{userDetails.credits} Credits</strong>
                    </div>
                </div>

                {errors.message && <div className="alert alert-danger mt-4">{errors.message}</div>}
                {message && <div className="alert alert-success mt-4">{message}</div>}

                <div className="row mt-5 justify-content-center">
                    {/* Monthly Plan */}
                    <div className="col-lg-4">
                        <div className="pricing-card">
                            <div className="card-header">
                                <h3>Monthly</h3>
                                <span className="price">₹199<span className="period">/month</span></span>
                            </div>
                            <div className="card-body">
                                <ul className="feature-list">
                                    {pricingList[1].list.map((item, i) => (
                                        <li key={i}>✓ {item.detail}</li>
                                    ))}
                                </ul>
                                <Button variant="outline-primary" className="w-100" onClick={() => handleSubscribe('UNLIMITED_MONTHLY')}>
                                    Choose Monthly
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Yearly Plan (Most Popular) */}
                    <div className="col-lg-4">
                        <div className="pricing-card popular">
                            <div className="popular-badge">Most Popular</div>
                            <div className="card-header">
                                <h3>Yearly</h3>
                                <span className="price">₹1990<span className="period">/year</span></span>
                            </div>
                            <div className="card-body">
                                <ul className="feature-list">
                                    {pricingList[2].list.map((item, i) => (
                                        <li key={i}>✓ {item.detail}</li>
                                    ))}
                                </ul>
                                <Button variant="primary" className="w-100" onClick={() => handleSubscribe('UNLIMITED_YEARLY')}>
                                    Choose Yearly
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Credit Packs */}
                    <div className="col-lg-4">
                        <div className="pricing-card">
                            <div className="card-header">
                                <h3>Credit Packs</h3>
                                <span className="price">Pay as you go</span>
                            </div>
                            <div className="card-body">
                                <ul className="feature-list">
                                    <li>One-time purchase</li>
                                    <li>Credits never expire</li>
                                    <li>Perfect for occasional use</li>
                                    <li>Top up whenever you need</li>
                                </ul>
                                <Button variant="outline-primary" className="w-100" onClick={() => setShowModal(true)}>
                                    Buy Credits
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buy Credits Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Select a Credit Pack</Modal.Title>
                </Modal.Header>
                <Modal.Body className="credit-modal-body">
                    {CREDIT_PACKS.map((c) => (
                        <Button
                            key={c}
                            variant="light"
                            className="credit-pack-btn"
                            onClick={() => handleBuyCredits(c)}
                        >
                            <span>Buy <strong>{c}</strong> Credits</span>
                            <span className="credit-price">₹{c}</span>
                        </Button>
                    ))}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default PurchaseCredit;
