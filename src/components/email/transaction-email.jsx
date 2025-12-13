import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

export function TransactionEmail({
  nameProduct = "Mobile Legends Diamond",
  noWa = "+62812345678",
  statusTransaction = "success", // process, pending, failed, success
  inputData = { uid: "83442149", zone: "2163" },
  amountPayment = "50000",
}) {
  // Konfigurasi untuk setiap status
  const statusConfig = {
    process: {
      title: "Transaction In Process",
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      icon: "⏳",
      message: "Your transaction is currently being processed",
      preview: "Your transaction is being processed",
    },
    pending: {
      title: "Payment Pending",
      color: "bg-yellow-600",
      hoverColor: "hover:bg-yellow-700",
      icon: "⏰",
      message: "Waiting for your payment confirmation",
      preview: "Payment pending - Action required",
    },
    failed: {
      title: "Transaction Failed",
      color: "bg-red-600",
      hoverColor: "hover:bg-red-700",
      icon: "❌",
      message: "Unfortunately, your transaction has failed",
      preview: "Transaction failed - Please try again",
    },
    success: {
      title: "Transaction Successful",
      color: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      icon: "✅",
      message: "Your transaction has been completed successfully",
      preview: "Transaction successful!",
    },
  };

  const config = statusConfig[statusTransaction] || statusConfig.success;

  // Format inputData menjadi array untuk ditampilkan
  const formatInputData = () => {
    if (!inputData || typeof inputData !== "object") return [];
    return Object.entries(inputData).map(([key, value]) => ({
      label: key.toUpperCase(),
      value: value,
    }));
  };

  // Format amount payment
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{config.preview}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="mx-auto bg-white rounded-[8px] shadow-sm max-w-[600px] px-[48px] py-[40px]">
            {/* Header with Status Icon */}
            <Section className="text-center mb-[32px]">
              <div className="text-[48px] mb-[16px]">{config.icon}</div>
              <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[8px]">
                {config.title}
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                {config.message}
              </Text>
            </Section>

            {/* Transaction Details */}
            <Section className="mb-[32px] bg-gray-50 rounded-[8px] p-[24px]">
              <Heading className="text-[18px] font-semibold text-gray-900 m-0 mb-[16px]">
                Transaction Details
              </Heading>

              {/* Product Name */}
              <div className="mb-[12px]">
                <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                  Product
                </Text>
                <Text className="text-[16px] text-gray-900 font-semibold m-0">
                  {nameProduct}
                </Text>
              </div>

              {/* WhatsApp Number */}
              <div className="mb-[12px]">
                <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                  WhatsApp Number
                </Text>
                <Text className="text-[16px] text-gray-900 font-semibold m-0">
                  {noWa}
                </Text>
              </div>

              {/* Dynamic Input Data */}
              {formatInputData().map((item, index) => (
                <div key={index} className="mb-[12px]">
                  <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                    {item.label}
                  </Text>
                  <Text className="text-[16px] text-gray-900 font-semibold m-0">
                    {item.value}
                  </Text>
                </div>
              ))}

              {/* Amount */}
              <div className="mt-[20px] pt-[20px] border-t border-gray-200">
                <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                  Total Payment
                </Text>
                <Text className="text-[24px] text-gray-900 font-bold m-0">
                  {formatAmount(amountPayment)}
                </Text>
              </div>
            </Section>

            {/* Status-specific Action */}
            {statusTransaction === "pending" && (
              <Section className="text-center mb-[32px]">
                <Button
                  href="#"
                  className={`${config.color} text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline ${config.hoverColor}`}
                >
                  Complete Payment
                </Button>
              </Section>
            )}

            {statusTransaction === "failed" && (
              <Section className="text-center mb-[32px]">
                <Button
                  href="#"
                  className={`${config.color} text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline ${config.hoverColor}`}
                >
                  Try Again
                </Button>
              </Section>
            )}

            {/* Additional Info based on status */}
            <Section className="mb-[32px]">
              {statusTransaction === "success" && (
                <Text className="text-[14px] text-gray-700 leading-[20px] m-0 bg-green-50 p-[16px] rounded-[8px] border border-green-200">
                  <strong>✓ Success!</strong> Your order has been processed and
                  will be delivered shortly. Please check your game account.
                </Text>
              )}

              {statusTransaction === "process" && (
                <Text className="text-[14px] text-gray-700 leading-[20px] m-0 bg-blue-50 p-[16px] rounded-[8px] border border-blue-200">
                  <strong>ℹ Processing...</strong> We are currently processing
                  your transaction. This usually takes 5-10 minutes.
                </Text>
              )}

              {statusTransaction === "pending" && (
                <Text className="text-[14px] text-gray-700 leading-[20px] m-0 bg-yellow-50 p-[16px] rounded-[8px] border border-yellow-200">
                  <strong>⚠ Action Required!</strong> Please complete your
                  payment within 24 hours to avoid cancellation.
                </Text>
              )}

              {statusTransaction === "failed" && (
                <Text className="text-[14px] text-gray-700 leading-[20px] m-0 bg-red-50 p-[16px] rounded-[8px] border border-red-200">
                  <strong>⚠ Transaction Failed!</strong> Your payment could not
                  be processed. Please check your payment method or contact
                  support.
                </Text>
              )}
            </Section>

            {/* Support Section */}
            <Section className="border-t border-gray-200 pt-[24px] mb-[24px]">
              <Text className="text-[14px] text-gray-600 leading-[20px] m-0 mb-[8px]">
                <strong>Need help?</strong> Contact our support team via
                WhatsApp
              </Text>
              <Text className="text-[14px] text-gray-600 leading-[20px] m-0">
                Response time: Usually within 5 minutes
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px]">
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0 mb-[8px]">
                Thank you for your purchase!
                <br />
                Customer Service Team
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                © {new Date().getFullYear()} Your Store. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default TransactionEmail;