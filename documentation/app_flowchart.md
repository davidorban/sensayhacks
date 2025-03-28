flowchart TD
  Start[Start] --> Auth[User Authentication via Supabase Auth]
  Auth --> Sidebar[Vertical Sidebar Navigation]
  Sidebar --> ReplicaTaskMemory[Replica Task Memory]
  Sidebar --> PureVoice[Pure Voice]
  Sidebar --> MCPClientServer[MCP Client Server]
  Sidebar --> TokenGatedMemories[Token Gated Memories]
  Sidebar --> TokenGuidedEvolution[Token Guided Evolution]
  Sidebar --> BondingReplicas[Bonding Replicas]
  Sidebar --> Chatroom[Chatroom]

  ReplicaTaskMemory --> RTM1[Chat Interface]
  RTM1 --> RTM2[Message Timestamps and Sender Labels]
  RTM2 --> RTM3[Task List Display]

  PureVoice --> PV1[Start Mock Voice Interaction Button]
  PV1 --> PV2[Placeholder Voice Flow Text]

  MCPClientServer --> MCP1[Data Input Fields]
  MCP1 --> MCP2[Process Request Button]
  MCP2 --> MCP3[Structured Output Display]

  TokenGatedMemories --> TGM1[Display Locked and Unlocked Memories]
  TGM1 --> TGM2[Unlock Mock Button]

  TokenGuidedEvolution --> TGE1[Display Replica Level]
  TGE1 --> TGE2[Evolve Mock SNSY Payment Button]
  TGE2 --> TGE3[Mock NFT Display]

  BondingReplicas --> BR1[Display Bonding Status]
  BR1 --> BR2[Toggle Mock Bond Button]
  BR2 --> BR3[Chat Interface for Bonded State]

  Chatroom --> CR1[Replica Selection]
  CR1 --> CR2[Initial Prompt]
  CR2 --> CR3[Start Replica Chat Button]
  CR3 --> CR4[Conversation Transcript]

  Sidebar --> EnvConfig[Environment Config: SENSAY API KEY, SUPABASE URL, SUPABASE ANON KEY]