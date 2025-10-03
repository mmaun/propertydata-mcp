#!/usr/bin/env node
/**
 * PropertyData MCP Server
 * 
 * A comprehensive MCP server providing access to PropertyData API endpoints
 * for UK property market analytics, valuations, and area data.
 * 
 * Usage: npx @yourname/propertydata-mcp
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

const API_KEY = process.env.PROPERTYDATA_API_KEY;
const BASE_URL = "https://api.propertydata.co.uk";

if (!API_KEY) {
  console.error("ERROR: PROPERTYDATA_API_KEY environment variable is required");
  console.error("Please set it in your Claude Desktop config");
  process.exit(1);
}

// API call helper
async function propertydataCall(
  endpoint: string,
  params: Record<string, any>
): Promise<any> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append("key", API_KEY as string);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      return { error: `API Error ${response.status}: ${errorText}` };
    }
    
    return await response.json();
  } catch (error) {
    return { error: `Request failed: ${error}` };
  }
}

// Define all tools
const tools = [
  // ADDRESS & PROPERTY LOOKUP
  {
    name: "address_match_uprn",
    description: "Match a UK property address to its Unique Property Reference Number (UPRN)",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string", description: "Full property address to match UPRN" }
      },
      required: ["address"]
    }
  },
  {
    name: "get_uprn_data",
    description: "Get property data using Unique Property Reference Number",
    inputSchema: {
      type: "object",
      properties: {
        uprn: { type: "string", description: "Unique Property Reference Number" }
      },
      required: ["uprn"]
    }
  },
  {
    name: "get_uprns",
    description: "Get all UPRNs in a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode to get UPRNs for" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_uprn_title",
    description: "Get land registry title information for a UPRN",
    inputSchema: {
      type: "object",
      properties: {
        uprn: { type: "string", description: "Unique Property Reference Number" }
      },
      required: ["uprn"]
    }
  },
  {
    name: "get_title_data",
    description: "Get land registry title data for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for title data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_title_use_class",
    description: "Get planning use class data from land registry titles",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for use class data" }
      },
      required: ["postcode"]
    }
  },
  
  // AREA ANALYSIS
  {
    name: "get_estate_agents",
    description: "Find estate agents operating in a specific postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode to search estate agents" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "analyse_buildings",
    description: "Get building analysis data for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode of the area to analyze" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_area_type",
    description: "Get area type classification (urban, suburban, rural etc.)",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for area type data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_postcode_key_stats",
    description: "Get key statistics summary for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for key statistics" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_demographics",
    description: "Get demographic data for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for demographic data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_population_data",
    description: "Get population data for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for population data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_household_income",
    description: "Get household income data for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for household income data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_politics_data",
    description: "Get political/voting data for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for political data" }
      },
      required: ["postcode"]
    }
  },
  
  // PROPERTY PRICES & VALUATIONS
  {
    name: "get_prices",
    description: "Get current property prices for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for property prices" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_prices_per_sqf",
    description: "Get property prices per square foot for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for price per sqf data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_sold_prices",
    description: "Get historical sold prices for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for sold prices data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_sold_prices_per_sqf",
    description: "Get historical sold prices per square foot for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for sold prices per sqf data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_valuation_sale",
    description: "Get sale valuation estimate for a postcode area or specific address",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for valuation" },
        address: { type: "string", description: "Specific address for valuation (optional)" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_valuation_rent",
    description: "Get rental valuation estimate for a postcode area or specific address",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for rental valuation" },
        address: { type: "string", description: "Specific address for valuation (optional)" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_valuation_hmo",
    description: "Get HMO (House in Multiple Occupation) valuation estimate",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for HMO valuation" },
        address: { type: "string", description: "Specific address for valuation (optional)" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_valuation_historical",
    description: "Get historical valuation data for a postcode area or specific address",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for historical valuations" },
        address: { type: "string", description: "Specific address for valuation (optional)" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_growth_data",
    description: "Get property price growth data for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for growth data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_growth_psf",
    description: "Get property price growth per square foot for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for growth per sqf data" }
      },
      required: ["postcode"]
    }
  },
  
  // RENTAL MARKET
  {
    name: "get_rental_demand",
    description: "Get property rental demand analytics for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for rental demand data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_rental_demand_rent",
    description: "Get rental demand with rent data for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for rental demand and rent data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_rents",
    description: "Get rental prices for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for rental prices" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_rents_hmo",
    description: "Get HMO rental prices for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for HMO rental prices" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_yields",
    description: "Get rental yield data for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for rental yields" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_lha_rate",
    description: "Get Local Housing Allowance rates for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for LHA rates" }
      },
      required: ["postcode"]
    }
  },
  
  // DEVELOPMENT & INVESTMENT
  {
    name: "get_sourced_properties",
    description: "Get sourced investment properties for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for sourced properties" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_sourced_property",
    description: "Get sourced property data for a specific UPRN",
    inputSchema: {
      type: "object",
      properties: {
        uprn: { type: "string", description: "Unique Property Reference Number" }
      },
      required: ["uprn"]
    }
  },
  {
    name: "development_calculator",
    description: "Calculate development metrics for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for development calculation" },
        build_cost: { type: "number", description: "Build cost per unit (optional)" },
        land_cost: { type: "number", description: "Land acquisition cost (optional)" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_development_gdv",
    description: "Get Gross Development Value estimates for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for GDV data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_build_cost",
    description: "Get building cost estimates for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for build cost data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_rebuild_cost",
    description: "Get rebuild cost estimates for insurance purposes",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for rebuild cost data" }
      },
      required: ["postcode"]
    }
  },
  
  // PLANNING & REGULATIONS
  {
    name: "get_planning_applications",
    description: "Get planning applications for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for planning applications" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_conservation_area",
    description: "Check if postcode area is in a conservation area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode to check conservation area status" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_listed_buildings",
    description: "Get listed buildings data for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for listed buildings data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_green_belt",
    description: "Check if postcode area is in green belt land",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode to check green belt status" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_aonb_data",
    description: "Check if postcode area is in Area of Outstanding Natural Beauty",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode to check AONB status" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_national_park",
    description: "Check if postcode area is in a National Park",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode to check National Park status" }
      },
      required: ["postcode"]
    }
  },
  
  // MARKET & FINANCIAL DATA
  {
    name: "get_council_tax",
    description: "Get council tax information for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for council tax data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "mortgage_calculator",
    description: "Calculate mortgage payments and affordability",
    inputSchema: {
      type: "object",
      properties: {
        loan_amount: { type: "number", description: "Loan amount in GBP" },
        deposit: { type: "number", description: "Deposit amount in GBP" },
        interest_rate: { type: "number", description: "Annual interest rate as percentage" },
        term_years: { type: "integer", description: "Mortgage term in years" }
      },
      required: ["loan_amount", "deposit", "interest_rate", "term_years"]
    }
  },
  {
    name: "get_mortgage_rates",
    description: "Get current mortgage rates for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for mortgage rates" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "stamp_duty_calculator",
    description: "Calculate stamp duty liability",
    inputSchema: {
      type: "object",
      properties: {
        property_value: { type: "number", description: "Property value in GBP" },
        first_time_buyer: { type: "boolean", description: "Whether buyer is first-time buyer (optional)" }
      },
      required: ["property_value"]
    }
  },
  
  // PROPERTY CHARACTERISTICS
  {
    name: "get_floor_areas",
    description: "Get floor area data for properties in a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for floor area data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_freeholds",
    description: "Get freehold/leasehold data for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for freehold data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_energy_efficiency",
    description: "Get energy efficiency (EPC) data for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for energy efficiency data" }
      },
      required: ["postcode"]
    }
  },
  
  // LOCATION & AMENITIES
  {
    name: "get_flood_risk",
    description: "Get flood risk information for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for flood risk data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_crime_data",
    description: "Get crime statistics for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for crime data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_schools_data",
    description: "Get schools information for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for schools data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_ptal_data",
    description: "Get Public Transport Accessibility Level (PTAL) data for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for PTAL data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_restaurants",
    description: "Get restaurants and dining data for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for restaurants data" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_internet_speed",
    description: "Get internet speed data for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for internet speed data" }
      },
      required: ["postcode"]
    }
  },
  
  // REGISTERS & DATABASES
  {
    name: "get_national_hmo_register",
    description: "Get HMO license data from national HMO register",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for HMO register data" }
      },
      required: ["postcode"]
    }
  },
  
  // DOCUMENTS & RECORDS
  {
    name: "get_land_registry_documents",
    description: "Get Land Registry documents for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for Land Registry documents" }
      },
      required: ["postcode"]
    }
  },
  {
    name: "get_site_plan_documents",
    description: "Get site plan documents for a postcode area",
    inputSchema: {
      type: "object",
      properties: {
        postcode: { type: "string", description: "UK postcode for site plan documents" }
      },
      required: ["postcode"]
    }
  },
  
  // ACCOUNT MANAGEMENT
  {
    name: "get_account_credits",
    description: "Get current API account credits and usage",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "get_account_documents",
    description: "Get account documents and downloads",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }
];

// Tool handler mapping
const toolHandlers: Record<string, (args: any) => Promise<any>> = {
  // ADDRESS & PROPERTY LOOKUP
  address_match_uprn: (args) => propertydataCall("/address-match-uprn", { address: args.address }),
  get_uprn_data: (args) => propertydataCall("/uprn", { uprn: args.uprn }),
  get_uprns: (args) => propertydataCall("/uprns", { postcode: args.postcode }),
  get_uprn_title: (args) => propertydataCall("/uprn-title", { uprn: args.uprn }),
  get_title_data: (args) => propertydataCall("/title", { postcode: args.postcode }),
  get_title_use_class: (args) => propertydataCall("/title-use-class", { postcode: args.postcode }),
  
  // AREA ANALYSIS
  get_estate_agents: (args) => propertydataCall("/agents", { postcode: args.postcode }),
  analyse_buildings: (args) => propertydataCall("/analyse-buildings", { postcode: args.postcode }),
  get_area_type: (args) => propertydataCall("/area-type", { postcode: args.postcode }),
  get_postcode_key_stats: (args) => propertydataCall("/postcode-key-stats", { postcode: args.postcode }),
  get_demographics: (args) => propertydataCall("/demographics", { postcode: args.postcode }),
  get_population_data: (args) => propertydataCall("/population", { postcode: args.postcode }),
  get_household_income: (args) => propertydataCall("/household-income", { postcode: args.postcode }),
  get_politics_data: (args) => propertydataCall("/politics", { postcode: args.postcode }),
  
  // PROPERTY PRICES & VALUATIONS
  get_prices: (args) => propertydataCall("/prices", { postcode: args.postcode }),
  get_prices_per_sqf: (args) => propertydataCall("/prices-per-sqf", { postcode: args.postcode }),
  get_sold_prices: (args) => propertydataCall("/sold-prices", { postcode: args.postcode }),
  get_sold_prices_per_sqf: (args) => propertydataCall("/sold-prices-per-sqf", { postcode: args.postcode }),
  get_valuation_sale: (args) => propertydataCall("/valuation-sale", { 
    postcode: args.postcode, 
    address: args.address 
  }),
  get_valuation_rent: (args) => propertydataCall("/valuation-rent", { 
    postcode: args.postcode, 
    address: args.address 
  }),
  get_valuation_hmo: (args) => propertydataCall("/valuation-hmo", { 
    postcode: args.postcode, 
    address: args.address 
  }),
  get_valuation_historical: (args) => propertydataCall("/valuation-historical", { 
    postcode: args.postcode, 
    address: args.address 
  }),
  get_growth_data: (args) => propertydataCall("/growth", { postcode: args.postcode }),
  get_growth_psf: (args) => propertydataCall("/growth-psf", { postcode: args.postcode }),
  
  // RENTAL MARKET
  get_rental_demand: (args) => propertydataCall("/demand", { postcode: args.postcode }),
  get_rental_demand_rent: (args) => propertydataCall("/demand-rent", { postcode: args.postcode }),
  get_rents: (args) => propertydataCall("/rents", { postcode: args.postcode }),
  get_rents_hmo: (args) => propertydataCall("/rents-hmo", { postcode: args.postcode }),
  get_yields: (args) => propertydataCall("/yields", { postcode: args.postcode }),
  get_lha_rate: (args) => propertydataCall("/lha-rate", { postcode: args.postcode }),
  
  // DEVELOPMENT & INVESTMENT
  get_sourced_properties: (args) => propertydataCall("/sourced-properties", { postcode: args.postcode }),
  get_sourced_property: (args) => propertydataCall("/sourced-property", { uprn: args.uprn }),
  development_calculator: (args) => propertydataCall("/development-calculator", {
    postcode: args.postcode,
    build_cost: args.build_cost,
    land_cost: args.land_cost
  }),
  get_development_gdv: (args) => propertydataCall("/development-gdv", { postcode: args.postcode }),
  get_build_cost: (args) => propertydataCall("/build-cost", { postcode: args.postcode }),
  get_rebuild_cost: (args) => propertydataCall("/rebuild-cost", { postcode: args.postcode }),
  
  // PLANNING & REGULATIONS
  get_planning_applications: (args) => propertydataCall("/planning-applications", { postcode: args.postcode }),
  get_conservation_area: (args) => propertydataCall("/conservation-area", { postcode: args.postcode }),
  get_listed_buildings: (args) => propertydataCall("/listed-buildings", { postcode: args.postcode }),
  get_green_belt: (args) => propertydataCall("/green-belt", { postcode: args.postcode }),
  get_aonb_data: (args) => propertydataCall("/aonb", { postcode: args.postcode }),
  get_national_park: (args) => propertydataCall("/national-park", { postcode: args.postcode }),
  
  // MARKET & FINANCIAL DATA
  get_council_tax: (args) => propertydataCall("/council-tax", { postcode: args.postcode }),
  mortgage_calculator: (args) => propertydataCall("/mortgage-calculator", {
    loan_amount: args.loan_amount,
    deposit: args.deposit,
    interest_rate: args.interest_rate,
    term_years: args.term_years
  }),
  get_mortgage_rates: (args) => propertydataCall("/mortgage-rates", { postcode: args.postcode }),
  stamp_duty_calculator: (args) => propertydataCall("/stamp-duty-calculator", {
    property_value: args.property_value,
    first_time_buyer: args.first_time_buyer
  }),
  
  // PROPERTY CHARACTERISTICS
  get_floor_areas: (args) => propertydataCall("/floor-areas", { postcode: args.postcode }),
  get_freeholds: (args) => propertydataCall("/freeholds", { postcode: args.postcode }),
  get_energy_efficiency: (args) => propertydataCall("/energy-efficiency", { postcode: args.postcode }),
  
  // LOCATION & AMENITIES
  get_flood_risk: (args) => propertydataCall("/flood-risk", { postcode: args.postcode }),
  get_crime_data: (args) => propertydataCall("/crime", { postcode: args.postcode }),
  get_schools_data: (args) => propertydataCall("/schools", { postcode: args.postcode }),
  get_ptal_data: (args) => propertydataCall("/ptal", { postcode: args.postcode }),
  get_restaurants: (args) => propertydataCall("/restaurants", { postcode: args.postcode }),
  get_internet_speed: (args) => propertydataCall("/internet-speed", { postcode: args.postcode }),
  
  // REGISTERS & DATABASES
  get_national_hmo_register: (args) => propertydataCall("/national-hmo-register", { postcode: args.postcode }),
  
  // DOCUMENTS & RECORDS
  get_land_registry_documents: (args) => propertydataCall("/land-registry-documents", { postcode: args.postcode }),
  get_site_plan_documents: (args) => propertydataCall("/site-plan-documents", { postcode: args.postcode }),
  
  // ACCOUNT MANAGEMENT
  get_account_credits: () => propertydataCall("/account/credits", {}),
  get_account_documents: () => propertydataCall("/account/documents", {})
};

// Create server
const server = new Server(
  {
    name: "propertydata-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  const handler = toolHandlers[name];
  if (!handler) {
    throw new Error(`Unknown tool: ${name}`);
  }

  try {
    const result = await handler(args || {});
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("PropertyData MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});