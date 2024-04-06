import React, { useEffect, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { CardNumberElement, useElements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";

const GooglePayButton = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const { userInfo } = useSelector(selectCurrentUser);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://pay.google.com/gp/p/js/pay.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGooglePayPayment = async () => {
    const googlePay = new google.payments.api.PaymentsClient({
      environment: "TEST", // Set to 'PRODUCTION' for live payments
      merchantInfo: {
        merchantId: "YOUR_MERCHANT_ID", // Your Google Pay Merchant ID
        merchantName: "Your Merchant Name",
      },
    });

    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["MASTERCARD", "VISA"],
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            parameters: {
              gateway: "stripe",
              stripe: {
                publishableKey: "YOUR_STRIPE_PUBLISHABLE_KEY",
              },
            },
          },
        },
      ],
      merchantInfo: {
        merchantId: "YOUR_MERCHANT_ID", // Your Google Pay Merchant ID
        merchantName: "Your Merchant Name",
      },
      transactionInfo: {
        totalPriceStatus: "FINAL",
        totalPriceLabel: "Total",
        totalPrice: `${order.totalPrice}`, // Total price in the smallest currency unit (e.g., cents)
        currencyCode: "INR",
      },
    };

    try {
      const paymentData = await googlePay.createButton({
        buttonColor: "default",
        buttonType: "long",
        onClick: async () => {
          try {
            const { data } = await axios.post("/api/orders/payment/process", {
              amount: order.totalPrice,
              shipping: {
                name: userInfo?.username,
                address: {
                  city: order?.shippingAddress.city,
                  postal_code: order?.shippingAddress.postalCode,
                  country: order?.shippingAddress.country,
                },
              },
            });

            const clientSecret = data.client_secret;

            const { error } = await stripe.confirmCardPayment(clientSecret, {
              payment_method: {
                card: elements.getElement(CardNumberElement),
                billing_details: {
                  name: userInfo.name,
                  email: userInfo.email,
                },
              },
            });

            if (error) {
              setPaymentError(error.message);
              toast.error(error.message);
            } else {
              toast.success("Payment successful!");
            }
          } catch (error) {
            setPaymentError(error?.response?.data?.message || error.message);
            toast.error(error?.response?.data?.message || error.message);
          }
        },
      });
      console.log(googlePay);

      googlePay.button.render(paymentData);
    } catch (error) {
      setPaymentError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div id="googlePayButton" onClick={handleGooglePayPayment}>
      Google Pay
    </div>
  );
};

export default GooglePayButton;
