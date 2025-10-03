# PropertyData MCP Server

A Model Context Protocol (MCP) server that provides seamless access to the PropertyData UK property market API through Claude Desktop and other MCP clients.

[![npm version](https://badge.fury.io/js/%40yourname%2Fpropertydata-mcp.svg)](https://www.npmjs.com/package/@yourname/propertydata-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🏠 Features

Access comprehensive UK property data including:

- **Property Valuations**: Sale, rental, and HMO valuations
- **Market Analysis**: Current prices, historical sales, growth trends
- **Area Intelligence**: Demographics, crime stats, schools, amenities
- **Rental Data**: Rental prices, yields, demand analytics, LHA rates
- **Development Tools**: Build costs, GDV calculations, planning data
- **Location Data**: Flood risk, transport links, energy efficiency
- **Regulatory Info**: Conservation areas, green belt, planning applications
- **Financial Tools**: Council tax, stamp duty calculator

**60+ endpoints** covering every aspect of UK property analysis!

## 🚀 Quick Start

### Prerequisites

1. **Get a PropertyData API Key**
   - Sign up at [PropertyData.co.uk](https://propertydata.co.uk)
   - Navigate to your account settings
   - Copy your API key

2. **Have Claude Desktop Installed**
   - Download from [claude.ai](https://claude.ai/download)

### Installation

No installation needed! Just configure Claude Desktop:

#### For macOS

1. Open the config file:
   ```bash
   code ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```
   Or manually navigate to: `~/Library/Application Support/Claude/`

2. Add this configuration:
   ```json
   {
     "mcpServers": {
       "propertydata": {
         "command": "npx",
         "args": [
           "-y",
           "@yourname/propertydata-mcp"
         ],
         "env": {
           "PROPERTYDATA_API_KEY": "your-api-key-here"
         }
       }
     }
   }
   ```

#### For Windows

1. Open the config file:
   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. Add the same configuration as above

### Restart Claude Desktop

Quit Claude completely (not just close the window) and restart it.

## ✅ Verify Installation

Ask Claude:
```
Can you check the PropertyData MCP server connection?
```

Then try a real query:
```
Get property prices for postcode SW1A 1AA
```

## 📚 Available Tools

### Address & Property Lookup
- `address_match_uprn` - Match address to UPRN
- `get_uprn_data` - Get property details by UPRN
- `get_uprns` - Get all UPRNs in postcode
- `get_uprn_title` - Get land registry title for UPRN
- `get_title_data` - Get land registry data

### Property Valuations
- `get_valuation_sale` - Sale price valuations
- `get_valuation_rent` - Rental valuations
- `get_valuation_hmo` - HMO valuations

### Market Data & Prices
- `get_prices` - Current property prices
- `get_prices_per_sqf` - Prices per square foot
- `get_sold_prices` - Historical sales data
- `get_growth_data` - Price growth trends

### Rental Market
- `get_rents` - Rental prices
- `get_rents_hmo` - HMO rental prices
- `get_yields` - Rental yields
- `get_rental_demand` - Demand analytics
- `get_lha_rate` - Local Housing Allowance rates

### Area Analysis
- `get_demographics` - Population demographics
- `get_population_data` - Population statistics
- `get_household_income` - Income data
- `get_postcode_key_stats` - Key area statistics
- `analyse_buildings` - Building analysis
- `get_estate_agents` - Local estate agents

### Development & Investment
- `get_sourced_properties` - Investment opportunities
- `development_calculator` - Development metrics
- `get_build_cost` - Building cost estimates

### Planning & Regulations
- `get_planning_applications` - Planning applications
- `get_conservation_area` - Conservation area status
- `get_green_belt` - Green belt status

### Location & Amenities
- `get_flood_risk` - Flood risk data
- `get_crime_data` - Crime statistics
- `get_schools_data` - Schools information
- `get_energy_efficiency` - EPC ratings

### Financial
- `get_council_tax` - Council tax information
- `stamp_duty_calculator` - Calculate stamp duty

### Account
- `get_account_credits` - Check API credits

## 💡 Example Queries

Ask Claude natural questions like:

```
What's the average property price in SW1A?

Get me a rental valuation for 10 Downing Street, SW1A 2AA

Show me crime statistics for postcode E1 6AN

What are the demographics of the N1 area?

Calculate stamp duty for a £500,000 property

Find HMO rental yields in M1 postcode

What's the flood risk for property in RG1?

Get planning applications in OX1 postcode
```

## 🔧 Advanced Configuration

### Multiple Servers

You can run multiple MCP servers:

```json
{
  "mcpServers": {
    "propertydata": {
      "command": "npx",
      "args": ["-y", "@yourname/propertydata-mcp"],
      "env": {
        "PROPERTYDATA_API_KEY": "your-key-here"
      }
    },
    "another-server": {
      "command": "npx",
      "args": ["-y", "@another/mcp-server"]
    }
  }
}
```

### Use Specific Version

Pin to a specific version:

```json
{
  "mcpServers": {
    "propertydata": {
      "command": "npx",
      "args": [
        "-y",
        "@yourname/propertydata-mcp@1.0.0"
      ],
      "env": {
        "PROPERTYDATA_API_KEY": "your-key-here"
      }
    }
  }
}
```

## 🐛 Troubleshooting

### Server Not Appearing

1. **Check JSON syntax** - Use [jsonlint.com](https://jsonlint.com) to validate
2. **Restart Claude completely** - Quit from menu, don't just close window
3. **Check logs**:
   - macOS: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%\Claude\logs\`

### API Key Issues

```
ERROR: PROPERTYDATA_API_KEY environment variable is required
```

**Solution**: Verify the API key is correctly set in the `env` section

### Connection Errors

- Ensure you have an active internet connection
- Verify your PropertyData API key is valid
- Check your PropertyData account has available credits

### NPX Not Found

**Solution**: Install Node.js from [nodejs.org](https://nodejs.org) (includes npm and npx)

### Slow First Start

The first time you run the server, npx downloads the package. This is normal and only happens once.

## 📖 API Documentation

For detailed information about each endpoint and data returned, see:
- [PropertyData API Documentation](https://propertydata.co.uk/api/documentation)
- [PropertyData API Guide](https://propertydata.co.uk/api)

## 🔐 Security Notes

- **Never commit your API key** to version control
- Keep your `claude_desktop_config.json` private
- API keys are only stored locally on your machine
- The MCP server only communicates with PropertyData API

## 🛠️ Development

Want to modify or extend this server?

```bash
# Clone the repository
git clone https://github.com/yourusername/propertydata-mcp.git
cd propertydata-mcp

# Install dependencies
npm install

# Build
npm run build

# Test locally (requires API key)
export PROPERTYDATA_API_KEY="your-key"
npm test
```

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 💬 Support

- **MCP Server Issues**: [GitHub Issues](https://github.com/yourusername/propertydata-mcp/issues)
- **PropertyData API**: [PropertyData Support](https://propertydata.co.uk/contact)
- **MCP Protocol**: [MCP Documentation](https://modelcontextprotocol.io)

## 🔗 Links

- [PropertyData Website](https://propertydata.co.uk)
- [Claude Desktop](https://claude.ai/download)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [npm Package](https://www.npmjs.com/package/@yourname/propertydata-mcp)

## 📊 Version History

### 1.0.0 (Latest)
- Initial release
- 40+ PropertyData API endpoints
- Full MCP protocol support
- NPX deployment support

---

**Made with ❤️ for UK property professionals**