# Token-Gated Memories Prototype

## Overview

The Token-Gated Memories prototype demonstrates a token-based economy for accessing and evolving AI memories. It showcases how blockchain tokens ($SNSY) can be used not only to unlock premium content but also to guide the development and specialization of AI knowledge through evolutionary pathways.

## Key Features

### 1. Token Economy
- **Token Balance Management**: Users can purchase, stake, and spend tokens
- **Tiered Access System**: Four tiers of memories (Public, Premium, Expert, Exclusive)
- **Transaction History**: Complete record of token transactions

### 2. Memory Management
- **Memory Cards**: Visual representation of memories with metadata
- **Memory Unlocking**: Spend tokens to unlock premium memories
- **Memory Marketplace**: Discover and purchase new memories
- **Time-Based Memory Decay**: Simulates knowledge degradation over time

### 3. Evolution System
- **Evolutionary Pathways**: Four distinct specialization paths:
  - **Analytical Enhancement**: Data processing, pattern recognition, predictive modeling
  - **Technical Enhancement**: Programming, system design, computational methods
  - **Creative Enhancement**: Content generation, artistic expression, innovative thinking
  - **Domain Expertise**: Specialized knowledge in specific fields

- **Stage-Based Evolution**: Four progressive stages for each pathway:
  - **Stage 1**: Basic capabilities (free)
  - **Stage 2**: Enhanced capabilities (50-70 tokens)
  - **Stage 3**: Advanced capabilities (90-150 tokens)
  - **Stage 4**: Expert capabilities (180-300 tokens)

- **Capability Framework**: Each evolution stage unlocks specific capabilities
  - Capabilities are displayed as badges on memories
  - Users can preview new capabilities before evolving

### 4. User Interface
- **Tab Navigation**: Memories, Evolution, Marketplace, Transactions
- **Interactive Cards**: Expandable cards for memories and evolution paths
- **Visual Indicators**: Progress bars, freshness meters, token costs
- **Modal Dialogs**: For token purchases, staking, and evolution

## Implementation Details

### State Management
- React useState hooks for managing application state
- Simulated API calls using setTimeout for async operations

### Data Structures
- **MemoryItem**: Core data structure for memories with properties for content, tier, cost, evolution stage, path, and capabilities
- **EvolutionPath**: Defines a specialization pathway with stages and prerequisites
- **EvolutionStage**: Defines a stage within a pathway with token cost and capabilities
- **Transaction**: Records token transactions with type, amount, and status

### Key Functions
- **handleUnlockMemory**: Processes token payment to unlock a memory
- **handleEvolveMemory**: Evolves a memory to a new stage along a pathway
- **purchaseMarketplaceMemory**: Acquires a new memory from the marketplace
- **handlePurchaseTokens**: Simulates purchasing tokens
- **handleStakeTokens**: Implements token staking mechanism
- **getMemoryFreshness**: Calculates memory decay based on time
- **canEvolveMemory**: Determines if a memory can be evolved
- **getAvailableEvolutionStages**: Retrieves available evolution options

## User Flow

1. **Initial Experience**:
   - User starts with 200 tokens
   - Public memories are accessible immediately
   - Premium, Expert, and Exclusive memories require tokens to unlock

2. **Token Acquisition**:
   - Purchase tokens through the token purchase modal
   - Stake tokens to earn rewards over time

3. **Memory Access**:
   - Browse memories in the Memories tab
   - Unlock premium memories by spending tokens
   - View memory details including content, freshness, and capabilities

4. **Memory Evolution**:
   - Navigate to the Evolution tab
   - Select a memory to evolve
   - Choose an evolution pathway and stage
   - Spend tokens to evolve the memory
   - Gain new capabilities based on the evolution path

5. **Memory Marketplace**:
   - Discover new memories in the Marketplace tab
   - Purchase memories using tokens
   - Add purchased memories to personal collection

## Technical Implementation

The prototype is built using:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hooks for state management
- Simulated API calls for backend interactions

## Future Enhancements

Potential future enhancements could include:
- Real blockchain integration for token transactions
- AI-generated memory content based on evolution path
- Social features for sharing evolved memories
- Memory fusion to combine capabilities from different paths
- Decay resistance mechanisms through continued token investment
