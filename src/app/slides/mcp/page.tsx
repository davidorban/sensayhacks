'use client';

import { Presentation } from '@/components/presentation/Presentation';
import { Slide } from '@/components/presentation/Slide';
import { Title, Subtitle, BulletList, CodeBlock } from '@/components/presentation/SlideContent';

export default function MCPSlides() {
  return (
    <Presentation>
      {/* Title Slide */}
      <Slide className="bg-gradient-to-br from-blue-900 to-black">
        <Title>Model Context Protocol (MCP)</Title>
        <Subtitle>Enabling AI models to dynamically request and receive context during inference</Subtitle>
      </Slide>

      {/* What is MCP */}
      <Slide>
        <Title>What is MCP?</Title>
        <BulletList items={[
          'A protocol enabling AI models to dynamically request context',
          'Reduces need for upfront context provision',
          'Makes interactions more efficient and context-aware',
          'Improves token usage efficiency'
        ]} />
      </Slide>

      {/* Dynamic Context */}
      <Slide>
        <Title>Dynamic Context</Title>
        <div className="grid grid-cols-2 gap-8">
          <BulletList items={[
            'Real-time context requests',
            'Query external knowledge bases',
            'Reduced token usage',
            'Improved efficiency',
            'Context-aware responses'
          ]} />
          <CodeBlock code={`// Example MCP Context Request
async function handleQuery(query) {
  const context = await mcp.request({
    type: 'knowledge_base',
    query: 'latest_sales_data'
  });
  return generateResponse(query, context);
}`} />
        </div>
      </Slide>

      {/* Tool Integration */}
      <Slide>
        <Title>Tool Integration</Title>
        <BulletList items={[
          'Access to specialized databases',
          'Integration with external tools',
          'Expanded capabilities',
          'No direct integration needed',
          'Flexible architecture'
        ]} />
      </Slide>

      {/* Learn More */}
      <Slide className="bg-gradient-to-br from-blue-900 to-black">
        <Title>Learn More</Title>
        <div className="flex flex-col items-center gap-4">
          <a href="/prototypes/mcp" className="text-xl hover:underline">Documentation</a>
          <a href="https://github.com/davidorban/sensayhacks" className="text-xl hover:underline">GitHub</a>
        </div>
      </Slide>
    </Presentation>
  );
}
