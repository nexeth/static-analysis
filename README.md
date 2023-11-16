# @nexeth/static-analysis

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

`@nexeth/static-analysis` is a static analysis tool written in TypeScript for Solidity smart contracts. It helps identify potential vulnerabilities, coding style violations, and other issues in Solidity code. This tool is based on the popular Slither tool but ported to TypeScript for use with the Bun runtime environment.

## Prerequisites

Before using `@nexeth/static-analysis`, ensure you have the following dependencies installed:

- [Bun](https://bun.sh) - The all-in-one toolkit for JavaScript and TypeScript apps that includes the Bun runtime and package manager.

## Installation

You can install `@nexeth/static-analysis` and its dependencies using `bun`:

```bash
bun install
```

## Usage

### Analyzing Solidity Code

To analyze a Solidity smart contract using @nexeth/static-analysis with the Bun runtime and package manager, follow these steps:

Make sure your Solidity code is available in a .sol file.

Run the following command to analyze the Solidity code:

```bash
bun scripts:analyse <path_to_solidity_file>
```

Replace <path_to_solidity_file> with the actual path to your Solidity file.

### Running Tests

You can run the included tests to verify the functionality of @nexeth/static-analysis:

```bash
bun test
```

### Linting

To check your TypeScript code for style and potential issues, you can use ESLint:

```bash
bun lint
```

### Configuration

Customize the analysis by modifying the configuration in scripts/analyse.ts.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **_Slither_**: Original inspiration for this tool.
- **_Solidity_**: The programming language for Ethereum smart contracts.
