const mongoose = require('mongoose');

// Test the phone regex pattern directly
const phoneRegex = /^[+]?[1-9]\d{1,14}$/;

const testNumbers = [
    "+918851929990",
    "918851929990", 
    "8851929990",
    "+91 8851929990",
    "+91-8851929990",
    "91-8851929990",
    "1234567890",
    "+1234567890",
    "123456789012345", // 15 digits
    "12345678901234567" // 17 digits (should fail)
];

console.log("Testing phone number regex: /^[+]?[1-9]\\d{1,14}$/\n");

testNumbers.forEach(number => {
    const isValid = phoneRegex.test(number);
    console.log(`${number.padEnd(20)} -> ${isValid ? '✅ Valid' : '❌ Invalid'}`);
});

console.log("\n--- Testing with spaces and dashes (should fail) ---");
const spaceDashNumbers = [
    "+91 8851929990",
    "+91-8851929990", 
    "91 8851 929990",
    "885-192-9990"
];

spaceDashNumbers.forEach(number => {
    const isValid = phoneRegex.test(number);
    console.log(`${number.padEnd(20)} -> ${isValid ? '✅ Valid' : '❌ Invalid'}`);
});
