---
theme: default
background: https://source.unsplash.com/collection/94734566/1920x1080
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## Model Context Protocol (MCP)
  SensayHacks Concept Presentation
drawings:
  persist: false
transition: slide-left
title: Model Context Protocol (MCP)
---

# Model Context Protocol (MCP)

Enabling AI models to dynamically request and receive context during inference

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

---
layout: default
---

# What is MCP?

<v-clicks>

- A protocol enabling AI models to dynamically request context
- Reduces need for upfront context provision
- Makes interactions more efficient and context-aware
- Improves token usage efficiency

</v-clicks>

---
layout: two-cols
---

# Dynamic Context

<v-clicks>

- Real-time context requests
- Query external knowledge bases
- Reduced token usage
- Improved efficiency
- Context-aware responses

</v-clicks>

::right::

```mermaid
sequenceDiagram
    participant User
    participant AI
    participant Context
    
    User->>AI: Query
    AI->>Context: Request Info
    Context->>AI: Provide Context
    AI->>User: Informed Response
```

---
layout: default
---

# Tool Integration

<v-clicks>

- Access to specialized databases
- Integration with external tools
- Expanded capabilities
- No direct integration needed
- Flexible architecture

</v-clicks>

---
layout: end
---

# Learn More

[Documentation](https://sensayhacks.com/prototypes/mcp) · [GitHub](https://github.com/davidorban/sensayhacks)
