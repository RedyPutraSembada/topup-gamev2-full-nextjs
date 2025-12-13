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
      title: "New Transaction - Processing",
      color: "bg-blue-600",
      icon: "⏳",
      message: "A new transaction is being processed",
      preview: "New transaction in process",
      badge: "PROCESSING",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    pending: {
      title: "New Transaction - Pending Payment",
      color: "bg-yellow-600",
      icon: "⏰",
      message: "Customer payment is pending",
      preview: "New pending transaction",
      badge: "PENDING",
      badgeColor: "bg-yellow-100 text-yellow-800",
    },
    failed: {
      title: "Transaction Failed",
      color: "bg-red-600",
      icon: "❌",
      message: "Transaction has failed",
      preview: "Transaction failed",
      badge: "FAILED",
      badgeColor: "bg-red-100 text-red-800",
    },
    success: {
      title: "Transaction Completed",
      color: "bg-green-600",
      icon: "✅",
      message: "Transaction completed successfully",
      preview: "Transaction successful",
      badge: "SUCCESS",
      badgeColor: "bg-green-100 text-green-800",
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

  // Get current date time
  const getCurrentDateTime = () => {
    return new Date().toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    });
  };

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{config.preview} - Admin Notification</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="mx-auto bg-white rounded-[8px] shadow-sm max-w-[600px] px-[48px] py-[40px]">
            {/* Header - Admin Notification */}
            <Section className="mb-[24px]">
              <div className="flex items-center justify-between mb-[16px]">
                <Text className="text-[12px] text-gray-500 font-semibold uppercase m-0">
                  Admin Notification
                </Text>
                <span
                  className={`${config.badgeColor} px-[12px] py-[4px] rounded-[4px] text-[12px] font-bold`}
                >
                  {config.badge}
                </span>
              </div>
            </Section>

            {/* Status Icon & Title */}
            <Section className="text-center mb-[32px]">
              <div className="text-[48px] mb-[16px]">{config.icon}</div>
              <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[8px]">
                {config.title}
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                {config.message}
              </Text>
              <Text className="text-[14px] text-gray-500 m-0 mt-[8px]">
                {getCurrentDateTime()}
              </Text>
            </Section>

            {/* Customer & Transaction Details */}
            <Section className="mb-[32px] bg-gray-50 rounded-[8px] p-[24px]">
              <Heading className="text-[18px] font-semibold text-gray-900 m-0 mb-[16px]">
                Customer Information
              </Heading>

              {/* WhatsApp Number */}
              <div className="mb-[12px]">
                <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                  Customer WhatsApp
                </Text>
                <Text className="text-[16px] text-gray-900 font-semibold m-0">
                  {noWa}
                </Text>
              </div>

              {/* Product Name */}
              <div className="mb-[12px]">
                <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                  Product Ordered
                </Text>
                <Text className="text-[16px] text-gray-900 font-semibold m-0">
                  {nameProduct}
                </Text>
              </div>

              {/* Dynamic Input Data - Game Account Info */}
              {formatInputData().length > 0 && (
                <div className="mt-[16px] pt-[16px] border-t border-gray-200">
                  <Text className="text-[14px] text-gray-600 m-0 mb-[8px] font-semibold">
                    Game Account Details
                  </Text>
                  {formatInputData().map((item, index) => (
                    <div key={index} className="mb-[8px] flex">
                      <Text className="text-[14px] text-gray-600 m-0 min-w-[80px]">
                        {item.label}:
                      </Text>
                      <Text className="text-[14px] text-gray-900 font-mono font-semibold m-0">
                        {item.value}
                      </Text>
                    </div>
                  ))}
                </div>
              )}

              {/* Amount */}
              <div className="mt-[20px] pt-[20px] border-t border-gray-200">
                <Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
                  Transaction Amount
                </Text>
                <Text className="text-[24px] text-gray-900 font-bold m-0">
                  {formatAmount(amountPayment)}
                </Text>
              </div>
            </Section>

            {/* Admin Action Required */}
            {(statusTransaction === "pending" ||
              statusTransaction === "process") && (
              <Section className="text-center mb-[32px]">
                <Button
                  href="#"
                  className={`${config.color} text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline`}
                >
                  View in Dashboard
                </Button>
              </Section>
            )}

            {/* Status Alert for Admin */}
            <Section className="mb-[32px]">
              {statusTransaction === "success" && (
                <Text className="text-[14px] text-gray-700 leading-[20px] m-0 bg-green-50 p-[16px] rounded-[8px] border border-green-200">
                  <strong>✓ Transaction Completed!</strong> The order has been
                  successfully processed and delivered to the customer.
                </Text>
              )}

              {statusTransaction === "process" && (
                <Text className="text-[14px] text-gray-700 leading-[20px] m-0 bg-blue-50 p-[16px] rounded-[8px] border border-blue-200">
                  <strong>ℹ Action Required!</strong> Please monitor this
                  transaction. Processing time: 5-10 minutes.
                </Text>
              )}

              {statusTransaction === "pending" && (
                <Text className="text-[14px] text-gray-700 leading-[20px] m-0 bg-yellow-50 p-[16px] rounded-[8px] border border-yellow-200">
                  <strong>⚠ Waiting for Payment!</strong> Customer needs to
                  complete payment within 24 hours. Monitor payment status.
                </Text>
              )}

              {statusTransaction === "failed" && (
                <Text className="text-[14px] text-gray-700 leading-[20px] m-0 bg-red-50 p-[16px] rounded-[8px] border border-red-200">
                  <strong>⚠ Transaction Failed!</strong> Please check the issue
                  and contact customer if needed. Consider offering support.
                </Text>
              )}
            </Section>

            {/* Quick Actions */}
            <Section className="border-t border-gray-200 pt-[24px] mb-[24px]">
              <Text className="text-[14px] text-gray-600 leading-[20px] m-0 mb-[12px] font-semibold">
                Quick Actions:
              </Text>
              <div className="flex gap-[8px]">
                <Text className="text-[14px] text-blue-600 leading-[20px] m-0">
                  • Contact Customer via WhatsApp
                </Text>
              </div>
              <div className="flex gap-[8px]">
                <Text className="text-[14px] text-blue-600 leading-[20px] m-0">
                  • View Transaction History
                </Text>
              </div>
              <div className="flex gap-[8px]">
                <Text className="text-[14px] text-blue-600 leading-[20px] m-0">
                  • Check Payment Status
                </Text>
              </div>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px]">
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0 mb-[8px]">
                This is an automated notification for administrators.
                <br />
                Transaction Management System
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                © {new Date().getFullYear()} Your Store Admin Panel. All rights
                reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default TransactionEmail;