"use client";
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Lock, 
  Unlock, 
  Coins, 
  Zap, 
  Key, 
  Database, 
  History, 
  Info, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Award,
  Star,
  GitBranch,
  BarChart,
  Sparkles
} from 'lucide-react';
import { Tooltip } from "@/components/ui/tooltip";

interface MemoryItem {
  id: string;
  title: string;
  content: string;
  tier: 'public' | 'premium' | 'expert' | 'exclusive';
  tokenCost: number;
  category: string;
  timestamp: string;
  decayRate: number;
  creator: string;
  popularity: number;
  evolutionStage?: number;
  evolutionPath?: string;
  capabilities?: string[];
}

interface EvolutionPath {
  id: string;
  name: string;
  description: string;
  stages: EvolutionStage[];
}

interface EvolutionStage {
  id: number;
  name: string;
  description: string;
  tokenCost: number;
  capabilities: string[];
  prerequisites: { stage: number; path?: string }[];
}

interface AccessTier {
  name: string;
  tokenRequirement: number;
  description: string;
  color: string;
  icon: React.ReactNode;
  details: {
    title: string;
    content: string;
  };
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  timestamp: string;
  status: string;
  memoryId?: string;
  memoryTitle?: string;
}

const TokenGatedMemoriesPage = () => {
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('memories');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(50);
  const [stakedTokens, setStakedTokens] = useState(0);
  const [stakingRewards, setStakingRewards] = useState(0);
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState(10);
  const [marketplaceMemories, setMarketplaceMemories] = useState<MemoryItem[]>([]);
  const [showMemoryDecay, setShowMemoryDecay] = useState(true);
  const [evolutionPaths, setEvolutionPaths] = useState<EvolutionPath[]>([]);
  const [selectedEvolutionPath, setSelectedEvolutionPath] = useState<string | null>(null);
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [availableEvolutionStages, setAvailableEvolutionStages] = useState<EvolutionStage[]>([]);

  // Define access tiers
  const accessTiers: AccessTier[] = [
    {
      name: 'public',
      tokenRequirement: 0,
      description: 'Basic memories accessible to all users',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: <Info className="h-4 w-4" />,
      details: {
        title: 'Public Tier Benefits',
        content: 'Access to basic memories, including project overviews and market analysis.'
      }
    },
    {
      name: 'premium',
      tokenRequirement: 50,
      description: 'Enhanced knowledge requiring basic token holdings',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: <Key className="h-4 w-4" />,
      details: {
        title: 'Premium Tier Benefits',
        content: 'Access to premium memories, including strategy documents and customer feedback analysis.'
      }
    },
    {
      name: 'expert',
      tokenRequirement: 200,
      description: 'Specialized information requiring significant token investment',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: <Database className="h-4 w-4" />,
      details: {
        title: 'Expert Tier Benefits',
        content: 'Access to expert memories, including technical architecture and financial projections.'
      }
    },
    {
      name: 'exclusive',
      tokenRequirement: 500,
      description: 'Unique insights available only to major token holders',
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: <Zap className="h-4 w-4" />,
      details: {
        title: 'Exclusive Tier Benefits',
        content: 'Access to exclusive memories, including proprietary algorithm details and partnership opportunities.'
      }
    }
  ];

  // Sample memories data
  const memories: MemoryItem[] = [
    {
      id: 'mem-1',
      title: 'Introduction to AI Ethics',
      content: 'AI ethics is the branch of ethics that focuses on the moral issues surrounding artificial intelligence systems, including their design, development, and deployment. Key principles include fairness, transparency, privacy, and accountability.',
      tier: 'public',
      tokenCost: 0,
      category: 'AI Fundamentals',
      timestamp: '2025-03-15',
      decayRate: 0.2,
      creator: 'Sensay Team',
      popularity: 85,
      evolutionStage: 1,
      evolutionPath: 'analytical',
      capabilities: ['basic_understanding']
    },
    {
      id: 'mem-2',
      title: 'Advanced Neural Network Architectures',
      content: 'Recent advancements in neural network architectures have led to significant improvements in model performance across various tasks. This memory covers transformer-based models, mixture of experts, and sparse architectures.',
      tier: 'premium',
      tokenCost: 25,
      category: 'Technical',
      timestamp: '2025-03-20',
      decayRate: 0.1,
      creator: 'AI Research Group',
      popularity: 92,
      evolutionStage: 2,
      evolutionPath: 'technical',
      capabilities: ['architecture_analysis', 'performance_optimization']
    },
    {
      id: 'mem-3',
      title: 'Market Analysis: AI Industry Trends 2025',
      content: 'Comprehensive analysis of AI industry trends for 2025, including market size, growth projections, key players, and emerging technologies. Valuable insights for investors and industry professionals.',
      tier: 'expert',
      tokenCost: 75,
      category: 'Market Intelligence',
      timestamp: '2025-03-25',
      decayRate: 0.5,
      creator: 'Market Insights Team',
      popularity: 88,
      evolutionStage: 3,
      evolutionPath: 'analytical',
      capabilities: ['trend_identification', 'market_forecasting', 'competitive_analysis']
    },
    {
      id: 'mem-4',
      title: 'Quantum Computing Applications in AI',
      content: 'Exploration of how quantum computing technologies are being applied to artificial intelligence problems, with a focus on quantum machine learning algorithms and their potential to revolutionize the field.',
      tier: 'exclusive',
      tokenCost: 150,
      category: 'Emerging Tech',
      timestamp: '2025-03-28',
      decayRate: 0.3,
      creator: 'Quantum AI Lab',
      popularity: 95,
      evolutionStage: 4,
      evolutionPath: 'technical',
      capabilities: ['quantum_algorithms', 'advanced_computation', 'theoretical_modeling']
    }
  ];

  // Initialize data
  useEffect(() => {
    // Initialize memories
    setMemories([
      {
        id: 'mem-1',
        title: 'Introduction to AI Ethics',
        content: 'AI ethics is the branch of ethics that focuses on the moral issues surrounding artificial intelligence systems, including their design, development, and deployment. Key principles include fairness, transparency, privacy, and accountability.',
        tier: 'public',
        tokenCost: 0,
        category: 'AI Fundamentals',
        timestamp: '2025-03-15',
        decayRate: 0.2,
        creator: 'Sensay Team',
        popularity: 85,
        evolutionStage: 1,
        evolutionPath: 'analytical',
        capabilities: ['basic_understanding']
      },
      {
        id: 'mem-2',
        title: 'Advanced Neural Network Architectures',
        content: 'Recent advancements in neural network architectures have led to significant improvements in model performance across various tasks. This memory covers transformer-based models, mixture of experts, and sparse architectures.',
        tier: 'premium',
        tokenCost: 25,
        category: 'Technical',
        timestamp: '2025-03-20',
        decayRate: 0.1,
        creator: 'AI Research Group',
        popularity: 92,
        evolutionStage: 2,
        evolutionPath: 'technical',
        capabilities: ['architecture_analysis', 'performance_optimization']
      },
      {
        id: 'mem-3',
        title: 'Market Analysis: AI Industry Trends 2025',
        content: 'Comprehensive analysis of AI industry trends for 2025, including market size, growth projections, key players, and emerging technologies. Valuable insights for investors and industry professionals.',
        tier: 'expert',
        tokenCost: 75,
        category: 'Market Intelligence',
        timestamp: '2025-03-25',
        decayRate: 0.5,
        creator: 'Market Insights Team',
        popularity: 88,
        evolutionStage: 3,
        evolutionPath: 'analytical',
        capabilities: ['trend_identification', 'market_forecasting', 'competitive_analysis']
      },
      {
        id: 'mem-4',
        title: 'Quantum Computing Applications in AI',
        content: 'Exploration of how quantum computing technologies are being applied to artificial intelligence problems, with a focus on quantum machine learning algorithms and their potential to revolutionize the field.',
        tier: 'exclusive',
        tokenCost: 150,
        category: 'Emerging Tech',
        timestamp: '2025-03-28',
        decayRate: 0.3,
        creator: 'Quantum AI Lab',
        popularity: 95,
        evolutionStage: 4,
        evolutionPath: 'technical',
        capabilities: ['quantum_algorithms', 'advanced_computation', 'theoretical_modeling']
      }
    ]);

    // Initialize marketplace memories
    setMarketplaceMemories([
      {
        id: 'market-1',
        title: 'Creative Writing Techniques for AI',
        content: 'Advanced techniques for improving AI-generated creative writing, including narrative structure, character development, and stylistic elements. Based on analysis of literary masterpieces.',
        tier: 'premium',
        tokenCost: 35,
        category: 'Creative',
        timestamp: '2025-03-22',
        decayRate: 0.1,
        creator: 'Creative AI Studio',
        popularity: 89,
        evolutionStage: 2,
        evolutionPath: 'creative',
        capabilities: ['storytelling', 'style_adaptation']
      },
      {
        id: 'market-2',
        title: 'Financial Market Prediction Models',
        content: 'Proprietary models for financial market prediction using advanced AI techniques. Includes historical performance data and implementation guidelines.',
        tier: 'expert',
        tokenCost: 120,
        category: 'Finance',
        timestamp: '2025-03-26',
        decayRate: 0.4,
        creator: 'FinTech Innovations',
        popularity: 91,
        evolutionStage: 3,
        evolutionPath: 'analytical',
        capabilities: ['financial_modeling', 'risk_assessment', 'portfolio_optimization']
      },
      {
        id: 'market-3',
        title: 'Medical Diagnosis Enhancement',
        content: 'Specialized knowledge for enhancing medical diagnosis capabilities in AI systems. Covers symptom analysis, differential diagnosis techniques, and integration with medical imaging.',
        tier: 'exclusive',
        tokenCost: 200,
        category: 'Healthcare',
        timestamp: '2025-03-27',
        decayRate: 0.2,
        creator: 'MedAI Research',
        popularity: 94,
        evolutionStage: 4,
        evolutionPath: 'domain',
        capabilities: ['medical_diagnosis', 'symptom_analysis', 'treatment_recommendation']
      }
    ]);

    // Initialize evolution paths
    setEvolutionPaths([
      {
        id: 'analytical',
        name: 'Analytical Enhancement',
        description: 'Evolve memories to enhance analytical capabilities, including data processing, pattern recognition, and predictive modeling.',
        stages: [
          {
            id: 1,
            name: 'Basic Analysis',
            description: 'Foundational analytical capabilities',
            tokenCost: 0,
            capabilities: ['basic_understanding'],
            prerequisites: []
          },
          {
            id: 2,
            name: 'Advanced Data Analysis',
            description: 'Enhanced capabilities for pattern recognition and data processing',
            tokenCost: 50,
            capabilities: ['statistical_analysis', 'trend_identification', 'data_visualization'],
            prerequisites: [{ stage: 1 }]
          },
          {
            id: 3,
            name: 'Predictive Modeling',
            description: 'Ability to create and evaluate predictive models',
            tokenCost: 100,
            capabilities: ['forecasting', 'scenario_analysis', 'risk_assessment'],
            prerequisites: [{ stage: 2, path: 'analytical' }]
          },
          {
            id: 4,
            name: 'Strategic Intelligence',
            description: 'Advanced strategic analysis and decision-making capabilities',
            tokenCost: 200,
            capabilities: ['strategic_planning', 'competitive_intelligence', 'decision_optimization'],
            prerequisites: [{ stage: 3, path: 'analytical' }]
          }
        ]
      },
      {
        id: 'technical',
        name: 'Technical Enhancement',
        description: 'Evolve memories to enhance technical capabilities, including programming, system design, and computational methods.',
        stages: [
          {
            id: 1,
            name: 'Basic Technical Understanding',
            description: 'Foundational technical knowledge',
            tokenCost: 0,
            capabilities: ['basic_understanding'],
            prerequisites: []
          },
          {
            id: 2,
            name: 'Advanced Technical Skills',
            description: 'Enhanced capabilities for technical problem-solving',
            tokenCost: 60,
            capabilities: ['code_generation', 'system_design', 'debugging'],
            prerequisites: [{ stage: 1 }]
          },
          {
            id: 3,
            name: 'Architecture Optimization',
            description: 'Ability to optimize and improve technical architectures',
            tokenCost: 120,
            capabilities: ['performance_tuning', 'scalability_design', 'security_implementation'],
            prerequisites: [{ stage: 2, path: 'technical' }]
          },
          {
            id: 4,
            name: 'Cutting-Edge Innovation',
            description: 'Advanced capabilities for technical innovation and research',
            tokenCost: 250,
            capabilities: ['research_methods', 'prototype_development', 'technical_writing'],
            prerequisites: [{ stage: 3, path: 'technical' }]
          }
        ]
      },
      {
        id: 'creative',
        name: 'Creative Enhancement',
        description: 'Evolve memories to enhance creative capabilities, including content generation, artistic expression, and innovative thinking.',
        stages: [
          {
            id: 1,
            name: 'Basic Creative Skills',
            description: 'Foundational creative capabilities',
            tokenCost: 0,
            capabilities: ['basic_understanding'],
            prerequisites: []
          },
          {
            id: 2,
            name: 'Advanced Creative Expression',
            description: 'Enhanced capabilities for creative content generation',
            tokenCost: 40,
            capabilities: ['storytelling', 'content_generation', 'style_adaptation'],
            prerequisites: [{ stage: 1 }]
          },
          {
            id: 3,
            name: 'Artistic Mastery',
            description: 'Sophisticated artistic capabilities across multiple domains',
            tokenCost: 90,
            capabilities: ['narrative_design', 'visual_composition', 'emotional_resonance'],
            prerequisites: [{ stage: 2, path: 'creative' }]
          },
          {
            id: 4,
            name: 'Creative Innovation',
            description: 'Cutting-edge creative capabilities for groundbreaking work',
            tokenCost: 180,
            capabilities: ['concept_development', 'cross_domain_synthesis', 'audience_engagement'],
            prerequisites: [{ stage: 3, path: 'creative' }]
          }
        ]
      },
      {
        id: 'domain',
        name: 'Domain Expertise',
        description: 'Evolve memories to develop specialized knowledge in specific domains like finance, medicine, or law.',
        stages: [
          {
            id: 1,
            name: 'Domain Introduction',
            description: 'Basic understanding of domain concepts',
            tokenCost: 0,
            capabilities: ['basic_understanding'],
            prerequisites: []
          },
          {
            id: 2,
            name: 'Domain Proficiency',
            description: 'Working knowledge of domain principles and practices',
            tokenCost: 70,
            capabilities: ['terminology_mastery', 'process_understanding', 'basic_application'],
            prerequisites: [{ stage: 1 }]
          },
          {
            id: 3,
            name: 'Domain Expertise',
            description: 'Advanced domain knowledge and specialized skills',
            tokenCost: 150,
            capabilities: ['advanced_application', 'problem_solving', 'domain_analysis'],
            prerequisites: [{ stage: 2, path: 'domain' }]
          },
          {
            id: 4,
            name: 'Domain Authority',
            description: 'Cutting-edge expertise and thought leadership in the domain',
            tokenCost: 300,
            capabilities: ['innovation', 'thought_leadership', 'complex_problem_solving'],
            prerequisites: [{ stage: 3, path: 'domain' }]
          }
        ]
      }
    ]);

    // Initialize transaction history
    setTransactionHistory([
      {
        id: 'tx-1',
        type: 'purchase',
        amount: 100,
        timestamp: '2025-03-15 09:30',
        status: 'completed'
      },
      {
        id: 'tx-2',
        type: 'unlock',
        amount: 25,
        timestamp: '2025-03-16 14:45',
        status: 'completed',
        memoryId: 'mem-2',
        memoryTitle: 'Advanced Neural Network Architectures'
      },
      {
        id: 'tx-3',
        type: 'stake',
        amount: 50,
        timestamp: '2025-03-18 11:20',
        status: 'completed'
      },
      {
        id: 'tx-4',
        type: 'evolution',
        amount: 50,
        timestamp: '2025-03-22 16:15',
        status: 'completed',
        memoryId: 'mem-1',
        memoryTitle: 'Introduction to AI Ethics'
      }
    ]);

    // Set initial token balance
    setTokenBalance(200);
  }, []);

  // Check if a memory can be evolved
  const canEvolveMemory = (memory: MemoryItem) => {
    if (!memory.evolutionPath || !memory.evolutionStage) return false;
    
    const path = evolutionPaths.find(p => p.id === memory.evolutionPath);
    if (!path) return false;
    
    const nextStage = path.stages.find(s => s.id === (memory.evolutionStage || 0) + 1);
    return !!nextStage && tokenBalance >= nextStage.tokenCost;
  };

  // Get available evolution stages for a memory
  const getAvailableEvolutionStages = (memory: MemoryItem) => {
    if (!memory.evolutionPath) return [];
    
    const path = evolutionPaths.find(p => p.id === memory.evolutionPath);
    if (!path) return [];
    
    return path.stages.filter(stage => {
      // Check if all prerequisites are met
      return stage.prerequisites.every(prereq => {
        if (prereq.path && prereq.path !== memory.evolutionPath) return false;
        return (memory.evolutionStage || 0) >= prereq.stage;
      });
    });
  };

  // Handle memory evolution
  const handleEvolveMemory = (memory: MemoryItem, stage: EvolutionStage) => {
    if (tokenBalance < stage.tokenCost) {
      alert('Insufficient token balance to evolve this memory.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update token balance
      setTokenBalance(prev => prev - stage.tokenCost);
      
      // Update memory with new evolution stage
      setMemories(prev => prev.map(m => {
        if (m.id === memory.id) {
          return {
            ...m,
            evolutionStage: stage.id,
            capabilities: [...(m.capabilities || []), ...stage.capabilities]
          };
        }
        return m;
      }));
      
      // Add transaction record
      setTransactionHistory(prev => [
        {
          id: `tx-${Date.now()}`,
          type: 'evolution',
          amount: stage.tokenCost,
          timestamp: new Date().toLocaleString(),
          status: 'completed',
          memoryId: memory.id,
          memoryTitle: memory.title
        },
        ...prev
      ]);
      
      setIsLoading(false);
      setShowEvolutionModal(false);
    }, 1500);
  };

  // Open evolution modal for a memory
  const openEvolutionModal = (memory: MemoryItem) => {
    setSelectedMemory(memory);
    const availableStages = getAvailableEvolutionStages(memory);
    setAvailableEvolutionStages(availableStages);
    setShowEvolutionModal(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6"> 
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Token-Gated Memories</h1> 
      <p className="mb-6 text-sm text-gray-300"> 
        Unlock exclusive AI memories and knowledge using $SNSY tokens.
      </p>

      <div className="bg-white rounded-lg shadow-lg flex-1 overflow-hidden flex flex-col">
        {/* Token Balance Header */}
        <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-2 rounded-full mr-3">
              <Coins className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">$SNSY Token Balance</h2>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-indigo-700">{tokenBalance} <span className="text-sm text-gray-500">tokens</span></p>
                <Tooltip content="$SNSY tokens control access to premium AI memories. Higher token holdings unlock more valuable information tiers." placement="top" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              onClick={() => setShowPurchaseModal(true)}
              disabled={isLoading}
            >
              <Coins className="h-4 w-4 mr-2" />
              Purchase Tokens
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowStakingModal(true)}
            >
              <Award className="h-4 w-4 mr-2" />
              Stake Tokens
            </Button>
            
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <input
                  type="checkbox"
                  id="showDecay"
                  checked={showMemoryDecay}
                  onChange={() => setShowMemoryDecay(!showMemoryDecay)}
                  className="mr-2"
                />
                <label htmlFor="showDecay" className="text-sm text-gray-600">Show Memory Decay</label>
              </div>
            </div>
            
            <Tooltip 
              content={`Your current token balance gives you access to all ${getHighestAccessibleTier()} tier memories and below.`}
              placement="bottom"
            >
              <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200 flex items-center cursor-help">
                Highest Access: <span className="font-semibold ml-1 capitalize">{getHighestAccessibleTier()}</span>
                <Star className="h-3 w-3 ml-1 text-amber-500" />
              </div>
            </Tooltip>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b border-gray-200">
              <TabsList className="p-0 bg-transparent border-b-0 h-12">
                <TabsTrigger value="memories" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none">
                  <Database className="h-4 w-4 mr-2" />
                  Memories
                </TabsTrigger>
                <TabsTrigger value="tiers" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none">
                  <Key className="h-4 w-4 mr-2" />
                  Access Tiers
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none">
                  <History className="h-4 w-4 mr-2" />
                  Transaction History
                </TabsTrigger>
                <TabsTrigger value="marketplace" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none">
                  <Coins className="h-4 w-4 mr-2" />
                  Marketplace
                </TabsTrigger>
                <TabsTrigger value="concept" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none">
                  <Info className="h-4 w-4 mr-2" />
                  Concept
                </TabsTrigger>
                <TabsTrigger value="evolution" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Evolution
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Memories Tab */}
            <TabsContent value="memories" className="flex-1 p-0 mt-0">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-2">
                <Button 
                  variant={!selectedTier ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedTier(null)}
                >
                  All Tiers
                </Button>
                {accessTiers.map((tier) => (
                  <Button 
                    key={tier.name}
                    variant={selectedTier === tier.name ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedTier(tier.name)}
                    className={selectedTier === tier.name ? "" : "border-gray-200"}
                  >
                    {tier.icon}
                    <span className="ml-1 capitalize">{tier.name}</span>
                  </Button>
                ))}
              </div>
              
              <div className="p-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFilteredMemories().map((memory) => {
                    const isAccessible = canAccessMemory(memory);
                    const tier = accessTiers.find(t => t.name === memory.tier);
                    const freshness = getMemoryFreshness(memory.timestamp, memory.decayRate);
                    
                    return (
                      <Card key={memory.id} className={`overflow-hidden ${isAccessible ? '' : 'bg-gray-50'}`}>
                        {isAccessible ? (
                          <div className="p-4">
                            <div className="flex items-center text-sm text-green-600 mb-2">
                              <Unlock className="h-3 w-3 mr-1" />
                              <span>Unlocked Memory</span>
                            </div>
                            <p className="text-sm text-gray-700">{memory.content}</p>
                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                {memory.tier === 'public' ? 'Free Access' : `${memory.tokenCost} $SNSY tokens`}
                              </span>
                              <Tooltip 
                                content={`This memory is part of the ${memory.tier} tier`}
                                placement="right"
                              />
                            </div>
                            
                            {showMemoryDecay && memory.decayRate > 0 && (
                              <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Memory Freshness</span>
                                  <span>{freshness}%</span>
                                </div>
                                <Progress value={freshness} />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Created: {memory.timestamp}</span>
                                  <span>By: {memory.creator}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-gray-100 p-4 rounded-md flex flex-col items-center justify-center space-y-3 border border-gray-200">
                            <div className="flex items-center text-gray-500">
                              <Lock className="h-5 w-5 mr-2" />
                              <span>This memory requires {tier?.tokenRequirement} $SNSY tokens to access</span>
                            </div>
                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-indigo-500 h-full" 
                                style={{ 
                                  width: `${Math.min(100, (tokenBalance / (tier?.tokenRequirement || 1)) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 w-full flex justify-between">
                              <span>Your balance: {tokenBalance}</span>
                              <span>Required: {tier?.tokenRequirement}</span>
                            </div>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleUnlockMemory(memory)}
                              disabled={isLoading || tokenBalance < memory.tokenCost}
                            >
                              {isLoading ? (
                                <span className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Unlocking...
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <Key className="h-4 w-4 mr-1" />
                                  Unlock with {memory.tokenCost} $SNSY
                                </span>
                              )}
                            </Button>
                            {tokenBalance < memory.tokenCost && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => {
                                  setPurchaseAmount(memory.tokenCost - tokenBalance);
                                  setShowPurchaseModal(true);
                                }}
                              >
                                <Coins className="h-4 w-4 mr-2" />
                                Purchase {memory.tokenCost - tokenBalance} more tokens
                              </Button>
                            )}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
            
            {/* Access Tiers Tab */}
            <TabsContent value="tiers" className="flex-1 p-0 mt-0">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Access Tiers Overview</h3>
                  <p className="text-gray-600 mb-6">
                    $SNSY tokens provide tiered access to exclusive AI memories and knowledge. Higher token holdings unlock more valuable information.
                  </p>
                  
                  <div className="space-y-6">
                    {accessTiers.map((tier) => {
                      const tierIndex = accessTiers.findIndex(t => t.name === tier.name);
                      const requiredTokens = accessTiers[tierIndex].tokenRequirement;
                      const progress = Math.min(100, (tokenBalance / (tier.tokenRequirement || 1)) * 100) || 0;
                      
                      return (
                        <div 
                          key={tier.name}
                          className={`p-4 rounded-lg border ${isAccessible ? tier.color : 'bg-gray-50 border-gray-200'}`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full mr-3 ${isAccessible ? 'bg-green-100' : 'bg-gray-200'}`}>
                                {isAccessible ? <Unlock className="h-5 w-5 text-green-600" /> : tier.icon}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800 capitalize">{tier.name} Tier</h4>
                                <p className="text-sm text-gray-600">{tier.description}</p>
                              </div>
                            </div>
                            <Badge className={isAccessible ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                              {isAccessible ? 'Unlocked' : 'Locked'}
                            </Badge>
                          </div>
                          
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">Token Requirement:</span>
                              <span className="font-semibold text-gray-800">{tier.tokenRequirement} $SNSY</span>
                            </div>
                            
                            <div className="space-y-2">
                              <Progress value={progress} className="h-2" />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Your balance: {tokenBalance} $SNSY</span>
                                <span>{progress.toFixed(0)}% Complete</span>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <Tooltip 
                                content={tier.details.content}
                                placement="top"
                              >
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="w-full"
                                >
                                  <HelpCircle className="h-4 w-4 mr-2" />
                                  {tier.details.title}
                                </Button>
                              </Tooltip>
                            </div>
                            
                            {!isAccessible && (
                              <div className="mt-4">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setPurchaseAmount(tier.tokenRequirement - tokenBalance);
                                    setShowPurchaseModal(true);
                                  }}
                                  className="w-full"
                                >
                                  <Coins className="h-4 w-4 mr-2" />
                                  Purchase {tier.tokenRequirement - tokenBalance} more tokens to unlock
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Transaction History Tab */}
            <TabsContent value="transactions" className="flex-1 p-0 mt-0">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-md font-semibold text-gray-700">Transaction History</h3>
                <p className="text-sm text-gray-500">
                  Record of your $SNSY token purchases and memory unlocks.
                </p>
              </div>
              
              <div className="p-4 overflow-y-auto flex-1">
                {transactionHistory.length > 0 ? (
                  <div>
                    {/* Token Usage Analytics */}
                    <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Token Usage Analytics</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                          <div className="flex items-center mb-1">
                            <Coins className="h-4 w-4 text-blue-600 mr-2" />
                            <h5 className="text-sm font-medium text-blue-700">Total Tokens Purchased</h5>
                          </div>
                          <p className="text-xl font-semibold text-blue-800">
                            {transactionHistory
                              .filter(tx => tx.type === 'purchase')
                              .reduce((sum, tx) => sum + tx.amount, 0)}
                          </p>
                        </div>
                        
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                          <div className="flex items-center mb-1">
                            <Key className="h-4 w-4 text-purple-600 mr-2" />
                            <h5 className="text-sm font-medium text-purple-700">Tokens Spent on Memories</h5>
                          </div>
                          <p className="text-xl font-semibold text-purple-800">
                            {transactionHistory
                              .filter(tx => tx.type === 'unlock')
                              .reduce((sum, tx) => sum + tx.amount, 0)}
                          </p>
                        </div>
                        
                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                          <div className="flex items-center mb-1">
                            <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                            <h5 className="text-sm font-medium text-green-700">Memories Unlocked</h5>
                          </div>
                          <p className="text-xl font-semibold text-green-800">
                            {transactionHistory
                              .filter(tx => tx.type === 'unlock')
                              .length}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <h5 className="text-xs font-medium text-gray-700 mb-2">Token Usage by Tier</h5>
                        <div className="space-y-2">
                          {accessTiers.filter(tier => tier.name !== 'public').map((tier) => {
                            const tierTransactions = transactionHistory
                              .filter(tx => {
                                if (tx.type !== 'unlock') return false;
                                const memory = memories.find(m => m.id === tx.memoryId);
                                return memory && memory.tier === tier.name;
                              });
                            
                            const tierTotal = tierTransactions.reduce((sum, tx) => sum + tx.amount, 0);
                            const tierCount = tierTransactions.length;
                            
                            const totalSpent = transactionHistory
                              .filter(tx => tx.type === 'unlock')
                              .reduce((sum, tx) => sum + tx.amount, 0);
                            
                            const percentage = totalSpent > 0 ? (tierTotal / totalSpent) * 100 : 0;
                            
                            return (
                              <div key={tier.name} className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <div className="flex items-center">
                                    {tier.icon}
                                    <span className="ml-1 capitalize">{tier.name}</span>
                                  </div>
                                  <span>{tierTotal} $SNSY ({tierCount} memories)</span>
                                </div>
                                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-indigo-500 h-full" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Transactions</h4>
                    <div className="space-y-3">
                      {transactionHistory.map((transaction) => (
                        <div key={transaction.id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <Badge className={transaction.type === 'purchase' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                                  {transaction.type === 'purchase' ? 'Purchase' : 'Memory Unlock'}
                                </Badge>
                                <span className="ml-2 text-sm text-gray-500">{transaction.timestamp}</span>
                              </div>
                              {transaction.type === 'unlock' && (
                                <div>
                                  <p className="text-sm text-gray-700 mt-1">Unlocked: {transaction.memoryTitle}</p>
                                  <p className="text-xs text-gray-500">
                                    Memory Tier: <span className="capitalize">
                                      {(() => {
                                        const memory = memories.find(m => m.id === transaction.memoryId);
                                        return memory ? memory.tier : 'Unknown';
                                      })()}
                                    </span>
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <p className={`font-semibold ${transaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.type === 'purchase' ? '+' : '-'}{transaction.amount} $SNSY
                              </p>
                              <p className="text-xs text-gray-500">
                                Status: <span className="capitalize">{transaction.status}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <History className="h-12 w-12 text-gray-300 mb-2" />
                    <p>No transactions yet.</p>
                    <p className="text-sm">Purchase tokens or unlock memories to see your transaction history.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Marketplace Tab */}
            <TabsContent value="marketplace" className="flex-1 p-0 mt-0">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Memory Marketplace</h3>
                  <p className="text-gray-600 mb-6">
                    Discover and purchase valuable memories from trusted creators. All marketplace memories are verified for quality and relevance.
                  </p>
                  
                  <div className="space-y-4">
                    {marketplaceMemories.map((memory) => {
                      const canPurchase = tokenBalance >= memory.tokenCost;
                      const freshness = getMemoryFreshness(memory.timestamp, memory.decayRate);
                      
                      return (
                        <div 
                          key={memory.id}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className={`p-4 border-b ${memory.tier === 'premium' ? 'bg-blue-50 border-blue-100' : memory.tier === 'expert' ? 'bg-purple-50 border-purple-100' : 'bg-amber-50 border-amber-100'}`}>
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold text-gray-800">{memory.title}</h4>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <Badge className="mr-2 capitalize">{memory.tier}</Badge>
                                  <span className="mr-2">{memory.category}</span>
                                  <span>by {memory.creator}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-indigo-700">{memory.tokenCost} $SNSY</div>
                                <div className="text-xs text-gray-500">Popularity: {memory.popularity}%</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <p className="text-sm text-gray-700">{memory.content.substring(0, 150)}...</p>
                            
                            {showMemoryDecay && (
                              <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Memory Freshness</span>
                                  <span>{freshness}%</span>
                                </div>
                                <Progress value={freshness} />
                                <p className="text-xs text-gray-500 mt-1">
                                  {freshness > 80 ? 'Very fresh content' : 
                                   freshness > 50 ? 'Moderately fresh content' : 
                                   'Content may need updating soon'}
                                </p>
                              </div>
                            )}
                            
                            <div className="mt-4">
                              <Button 
                                variant={canPurchase ? "default" : "outline"}
                                className="w-full"
                                disabled={!canPurchase}
                                onClick={() => purchaseMarketplaceMemory(memory)}
                              >
                                <Coins className="h-4 w-4 mr-2" />
                                {canPurchase ? 'Purchase Memory' : 'Insufficient Tokens'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Concept Tab */}
            <TabsContent value="concept" className="flex-1 p-0 mt-0">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-indigo-700 mt-0">Core Concept</h3>
                  <p className="text-gray-700 mb-4">
                    Token Gated Memories is a framework that uses blockchain tokens ($SNSY) to control access to specific AI memories, knowledge, and capabilities.
                  </p>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mt-6">How It Works</h4>
                  <div className="space-y-4 mt-3">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <Key className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800">Access Control</h5>
                        <p className="text-gray-600 text-sm">
                          Token holdings determine which memory tiers a user can access. Higher token holdings unlock more valuable information.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <Coins className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800">Token Economy</h5>
                        <p className="text-gray-600 text-sm">
                          Users can purchase, stake, and earn $SNSY tokens. Tokens can be spent to unlock memories or staked to earn passive rewards.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <Database className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800">Memory Marketplace</h5>
                        <p className="text-gray-600 text-sm">
                          A decentralized marketplace where users can discover, purchase, and sell valuable memories, creating a knowledge economy.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <TrendingUp className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800">Memory Decay</h5>
                        <p className="text-gray-600 text-sm">
                          Memories have varying decay rates, reflecting how quickly information becomes outdated. Fresher memories provide more value.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mt-8">Use Cases</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-800">Premium Knowledge Services</h5>
                      <p className="text-gray-600 text-sm mt-1">
                        Organizations can monetize specialized knowledge by gating access to premium insights and analysis.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-800">Exclusive Communities</h5>
                      <p className="text-gray-600 text-sm mt-1">
                        Communities can use token holdings to determine access to exclusive discussions and shared knowledge.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-800">Enterprise Solutions</h5>
                      <p className="text-gray-600 text-sm mt-1">
                        Businesses can implement tiered access to sensitive information based on employee roles and clearance levels.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-800">Research Collaboration</h5>
                      <p className="text-gray-600 text-sm mt-1">
                        Research teams can share findings with appropriate access controls while maintaining intellectual property rights.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Evolution Tab */}
            <TabsContent value="evolution" className="flex-1 p-0 mt-0">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Evolutionary Pathways</h3>
                  <p className="text-gray-600 mb-6">
                    Evolve your memories along different pathways to unlock new capabilities and insights. Each evolution stage enhances the value and utility of your memories.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {evolutionPaths.map(path => (
                      <Card key={path.id} className="overflow-hidden border-2 hover:border-indigo-300 transition-all cursor-pointer" onClick={() => setSelectedEvolutionPath(path.id === selectedEvolutionPath ? null : path.id)}>
                        <div className="p-4">
                          <div className="flex items-center mb-2">
                            {path.id === 'analytical' && <BarChart className="h-5 w-5 text-indigo-600 mr-2" />}
                            {path.id === 'technical' && <Zap className="h-5 w-5 text-indigo-600 mr-2" />}
                            {path.id === 'creative' && <Sparkles className="h-5 w-5 text-indigo-600 mr-2" />}
                            {path.id === 'domain' && <Database className="h-5 w-5 text-indigo-600 mr-2" />}
                            <h4 className="font-semibold text-indigo-700">{path.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600">{path.description}</p>
                          
                          {selectedEvolutionPath === path.id && (
                            <div className="mt-4 space-y-3">
                              {path.stages.map(stage => (
                                <div key={stage.id} className="bg-gray-50 p-3 rounded border border-gray-200">
                                  <div className="flex justify-between items-center mb-2">
                                    <div>
                                      <h5 className="font-semibold text-gray-800">Stage {stage.id}: {stage.name}</h5>
                                      <p className="text-xs text-gray-600">{stage.description}</p>
                                    </div>
                                    <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                                      {stage.tokenCost} $SNSY
                                    </Badge>
                                  </div>
                                  
                                  {stage.capabilities.length > 0 && (
                                    <div className="mt-2">
                                      <h6 className="text-xs font-semibold text-gray-700">Capabilities:</h6>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {stage.capabilities.map(capability => (
                                          <Badge key={capability} variant="outline" className="text-xs">
                                            {capability.replace('_', ' ')}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mt-8">Your Evolvable Memories</h3>
                  <div className="space-y-4 mt-4">
                    {memories.filter(m => m.evolutionPath).map((memory) => {
                      const path = evolutionPaths.find(p => p.id === memory.evolutionPath);
                      const currentStage = path?.stages.find(s => s.id === memory.evolutionStage);
                      const nextStage = path?.stages.find(s => s.id === (memory.evolutionStage || 0) + 1);
                      const canEvolve = canEvolveMemory(memory);
                      
                      return (
                        <div 
                          key={memory.id}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className={`p-4 border-b ${memory.tier === 'premium' ? 'bg-blue-50 border-blue-100' : memory.tier === 'expert' ? 'bg-purple-50 border-purple-100' : memory.tier === 'exclusive' ? 'bg-amber-50 border-amber-100' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold text-gray-800">{memory.title}</h4>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <Badge className="mr-2 capitalize">{memory.tier}</Badge>
                                  <span className="mr-2">{memory.category}</span>
                                  <span>by {memory.creator}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-indigo-700">{memory.tokenCost} $SNSY</div>
                                <div className="text-xs text-gray-500">Popularity: {memory.popularity}%</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <p className="text-sm text-gray-700 mb-4">{memory.content.substring(0, 120)}...</p>
                            
                            <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-4">
                              <div className="flex items-center mb-2">
                                <GitBranch className="h-4 w-4 text-indigo-600 mr-2" />
                                <span className="font-semibold text-indigo-700">
                                  Current: Stage {memory.evolutionStage}
                                </span>
                              </div>
                              
                              <div className="text-sm text-gray-700">
                                {memory.capabilities && memory.capabilities.length > 0 && (
                                  <div className="mt-2">
                                    <div className="text-xs font-semibold text-gray-700">Current Capabilities:</div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {memory.capabilities.map(capability => (
                                        <Badge key={capability} variant="outline" className="text-xs">
                                          {capability.replace('_', ' ')}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <Button 
                                variant="default" 
                                className="w-full"
                                disabled={!canEvolve}
                                onClick={() => openEvolutionModal(memory)}
                              >
                                <GitBranch className="h-4 w-4 mr-2" />
                                {canEvolve ? 'Evolve to Next Stage' : nextStage ? `Need ${nextStage.tokenCost} $SNSY to Evolve` : 'Fully Evolved'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Token Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Purchase $SNSY Tokens</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Amount to Purchase</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(parseInt(e.target.value) || 0)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                  <span className="ml-2 text-gray-600">$SNSY</span>
                </div>
              </div>
              
              <div className="bg-indigo-50 p-3 rounded-md border border-indigo-100">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                  <p className="text-sm text-indigo-700">
                    This is a simulated purchase. In a real implementation, this would connect to a wallet or payment provider.
                  </p>
                </div>
              </div>
              
              {/* Tier Recommendations */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Recommended Token Packages</h4>
                <div className="space-y-3">
                  {accessTiers.filter(tier => tier.tokenRequirement > 0).map((tier) => {
                    const tokensNeeded = Math.max(0, tier.tokenRequirement - tokenBalance);
                    const isUnlocked = tokenBalance >= tier.tokenRequirement;
                    
                    return (
                      <div 
                        key={tier.name}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          purchaseAmount === tokensNeeded && tokensNeeded > 0
                            ? 'bg-indigo-50 border-indigo-200' 
                            : isUnlocked 
                              ? 'bg-green-50 border-green-200'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => tokensNeeded > 0 && setPurchaseAmount(tokensNeeded)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full mr-2 ${isUnlocked ? 'bg-green-100' : tier.color}`}>
                              {isUnlocked ? <Unlock className="h-4 w-4 text-green-600" /> : tier.icon}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-800 capitalize">{tier.name} Tier</h5>
                              <p className="text-xs text-gray-600">{tier.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${isUnlocked ? 'text-green-600' : 'text-indigo-600'}`}>
                              {isUnlocked ? 'Unlocked' : `${tokensNeeded} $SNSY`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {isUnlocked 
                                ? `${tokenBalance - tier.tokenRequirement} tokens above threshold` 
                                : `Unlock ${tier.name} tier`}
                            </p>
                          </div>
                        </div>
                        
                        {tokensNeeded > 0 && (
                          <div className="mt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPurchaseAmount(tokensNeeded);
                              }}
                            >
                              <Award className="h-4 w-4 mr-1" />
                              Select {tokensNeeded} tokens
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowPurchaseModal(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                variant="default"
                onClick={handlePurchaseTokens}
                disabled={isLoading || purchaseAmount <= 0}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Coins className="h-4 w-4 mr-2" />
                    Purchase {purchaseAmount} Tokens
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Staking Modal */}
      {showStakingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Stake $SNSY Tokens</h3>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                Stake your tokens to earn passive rewards. Staked tokens continue to count toward your tier access levels.
              </p>
              
              <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Current Balance:</span>
                  <span className="font-semibold">{tokenBalance} $SNSY</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-700">Currently Staked:</span>
                  <span className="font-semibold">{stakedTokens} $SNSY</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-700">Reward Rate:</span>
                  <span className="font-semibold text-green-600">5% per period</span>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to Stake
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="1"
                    max={tokenBalance}
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(parseInt(e.target.value))}
                    className="w-full mr-4"
                    disabled={tokenBalance === 0}
                  />
                  <span className="font-semibold text-indigo-700 w-16 text-right">{stakeAmount} $SNSY</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowStakingModal(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStakeTokens}
                disabled={isLoading || tokenBalance < stakeAmount}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isLoading ? 'Processing...' : 'Stake Tokens'}
              </Button>
              <Button 
                onClick={() => {
                  if (stakingRewards <= 0) return;
                  setTokenBalance(prev => prev + stakingRewards);
                  setStakingRewards(0);
                  setTransactionHistory(prev => [
                    {
                      id: `tx-${Date.now()}`,
                      type: 'reward',
                      amount: stakingRewards,
                      timestamp: new Date().toLocaleString(),
                      status: 'completed'
                    },
                    ...prev
                  ]);
                }}
                disabled={stakingRewards <= 0}
              >
                Claim Rewards
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Evolution Modal */}
      {showEvolutionModal && selectedMemory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Evolve Memory</h3>
              <p className="text-sm text-gray-600">
                Enhance "{selectedMemory.title}" with new capabilities
              </p>
            </div>
            
            <div className="p-4">
              <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-4">
                <div className="flex items-center mb-2">
                  <GitBranch className="h-4 w-4 text-indigo-600 mr-2" />
                  <span className="font-semibold text-indigo-700">
                    Current: Stage {selectedMemory.evolutionStage}
                  </span>
                </div>
                
                <div className="text-sm text-gray-700">
                  {selectedMemory.capabilities && selectedMemory.capabilities.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs font-semibold text-gray-700">Current Capabilities:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedMemory.capabilities.map(capability => (
                          <Badge key={capability} variant="outline" className="text-xs">
                            {capability.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-800 mb-2">Available Evolution Stages</h4>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {availableEvolutionStages
                  .filter(stage => stage.id > (selectedMemory.evolutionStage || 0))
                  .map(stage => (
                    <div 
                      key={stage.id}
                      className="bg-indigo-50 p-3 rounded border border-indigo-100 cursor-pointer hover:border-indigo-300 transition-all"
                      onClick={() => handleEvolveMemory(selectedMemory, stage)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-semibold text-indigo-700">Stage {stage.id}: {stage.name}</h5>
                          <p className="text-xs text-gray-600">{stage.description}</p>
                        </div>
                        <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                          {stage.tokenCost} $SNSY
                        </Badge>
                      </div>
                      
                      {stage.capabilities.length > 0 && (
                        <div className="mt-2">
                          <h6 className="text-xs font-semibold text-gray-700">New Capabilities:</h6>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {stage.capabilities.map(capability => (
                              <Badge key={capability} variant="outline" className="text-xs bg-white">
                                {capability.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                
                {availableEvolutionStages.filter(stage => stage.id > (selectedMemory.evolutionStage || 0)).length === 0 && (
                  <div className="text-center p-4 text-gray-500">
                    This memory has reached its maximum evolution stage.
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
              <Button 
                variant="outline"
                onClick={() => setShowEvolutionModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenGatedMemoriesPage;
