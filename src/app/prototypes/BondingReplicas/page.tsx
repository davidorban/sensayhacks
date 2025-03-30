// src/app/prototypes/BondingReplicas/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, Users, Share2, Brain, Shield, Lock, Unlock, Clock, Database, Settings, MessageSquare, Info } from 'lucide-react';

interface SharedMemoryItem {
  id: string;
  type: 'explicit' | 'implicit';
  category: string;
  content: string;
  timestamp: string;
  source: string;
}

interface Replica {
  id: string;
  name: string;
  specialty: string;
  bondStatus: 'bonded' | 'unbonded';
  bondPermission: 'read' | 'write' | 'admin';
}

const BondingReplicasPage = () => {
  const [isBonded, setIsBonded] = useState(false);
  const [bondStrength, setBondStrength] = useState(50);
  const [sharedMemory, setSharedMemory] = useState<SharedMemoryItem[]>([]);
  const [activeTab, setActiveTab] = useState('memory');
  const [bondSettings, setBondSettings] = useState({
    duration: 24, // in hours, 0 = permanent
    scope: ['userPreferences', 'projectData', 'conversationHistory'],
    permissionLevel: 'write' as 'read' | 'write' | 'admin',
    syncFrequency: 'realtime' as 'realtime' | 'periodic' | 'manual'
  });
  const [replicas, setReplicas] = useState<Replica[]>([
    { id: 'replica1', name: 'Memory Replica', specialty: 'Knowledge management', bondStatus: 'unbonded', bondPermission: 'read' },
    { id: 'replica2', name: 'Sync Replica', specialty: 'State synchronization', bondStatus: 'unbonded', bondPermission: 'read' },
    { id: 'replica3', name: 'Goal Replica', specialty: 'Task planning', bondStatus: 'unbonded', bondPermission: 'read' }
  ]);
  const [newMemoryInput, setNewMemoryInput] = useState('');
  const [selectedMemoryType, setSelectedMemoryType] = useState<'explicit' | 'implicit'>('explicit');
  const [selectedMemoryCategory, setSelectedMemoryCategory] = useState('userPreferences');
  const [bondId, setBondId] = useState('');
  const [bondCreationTime, setBondCreationTime] = useState('');
  const [bondExpiryTime, setBondExpiryTime] = useState('');
  const [syncStatus, setSyncStatus] = useState('idle');
  const [bondEvents, setBondEvents] = useState<string[]>([]);

  // Generate a random bond ID when bonding is enabled
  useEffect(() => {
    if (isBonded && !bondId) {
      const newBondId = `bond-${Math.random().toString(36).substring(2, 10)}`;
      setBondId(newBondId);
      
      const now = new Date();
      setBondCreationTime(now.toLocaleString());
      
      if (bondSettings.duration > 0) {
        const expiryTime = new Date(now.getTime() + bondSettings.duration * 60 * 60 * 1000);
        setBondExpiryTime(expiryTime.toLocaleString());
      } else {
        setBondExpiryTime('Permanent');
      }
      
      // Add bond creation event
      addBondEvent(`Bond ${newBondId} created`);
    } else if (!isBonded) {
      setBondId('');
      setBondCreationTime('');
      setBondExpiryTime('');
    }
  }, [isBonded, bondId, bondSettings.duration]);

  // Simulate periodic sync events when bonded
  useEffect(() => {
    let syncInterval: NodeJS.Timeout;
    
    if (isBonded && bondSettings.syncFrequency === 'periodic') {
      syncInterval = setInterval(() => {
        setSyncStatus('syncing');
        addBondEvent('Periodic sync in progress...');
        
        setTimeout(() => {
          setSyncStatus('idle');
          addBondEvent('Periodic sync completed');
        }, 1500);
      }, 10000); // Every 10 seconds
    }
    
    return () => {
      if (syncInterval) clearInterval(syncInterval);
    };
  }, [isBonded, bondSettings.syncFrequency]);

  // Update replica bond status when bonding is toggled
  useEffect(() => {
    if (isBonded) {
      const updatedReplicas = replicas.map(replica => ({
        ...replica,
        bondStatus: 'bonded' as const
      }));
      setReplicas(updatedReplicas);
    } else {
      const updatedReplicas = replicas.map(replica => ({
        ...replica,
        bondStatus: 'unbonded' as const
      }));
      setReplicas(updatedReplicas);
    }
  }, [isBonded]);

  const handleToggleBonding = () => {
    const newState = !isBonded;
    setIsBonded(newState);
    
    if (newState) {
      // Initialize shared memory when bonding is enabled
      setSharedMemory([
        {
          id: `mem-${Math.random().toString(36).substring(2, 10)}`,
          type: 'explicit',
          category: 'userPreferences',
          content: 'User prefers dark mode interfaces',
          timestamp: new Date().toLocaleString(),
          source: 'Memory Replica'
        },
        {
          id: `mem-${Math.random().toString(36).substring(2, 10)}`,
          type: 'explicit',
          category: 'projectData',
          content: 'Project Phoenix deadline is May 15th, 2025',
          timestamp: new Date().toLocaleString(),
          source: 'Goal Replica'
        },
        {
          id: `mem-${Math.random().toString(36).substring(2, 10)}`,
          type: 'implicit',
          category: 'conversationHistory',
          content: 'User expressed excitement about the upcoming launch',
          timestamp: new Date().toLocaleString(),
          source: 'Sync Replica'
        }
      ]);
      
      // Simulate sync event
      setSyncStatus('syncing');
      addBondEvent('Initial bond synchronization started');
      
      setTimeout(() => {
        setSyncStatus('idle');
        addBondEvent('Initial bond synchronization completed');
      }, 2000);
    } else {
      // Clear shared memory when bonding is disabled
      setSharedMemory([]);
      addBondEvent('Bond disconnected, shared memory cleared');
    }
  };

  const handleAddMemory = () => {
    if (newMemoryInput.trim() === '') return;
    
    const newMemory: SharedMemoryItem = {
      id: `mem-${Math.random().toString(36).substring(2, 10)}`,
      type: selectedMemoryType,
      category: selectedMemoryCategory,
      content: newMemoryInput,
      timestamp: new Date().toLocaleString(),
      source: 'User'
    };
    
    setSharedMemory(prev => [...prev, newMemory]);
    setNewMemoryInput('');
    
    // Simulate sync event
    setSyncStatus('syncing');
    addBondEvent(`New ${selectedMemoryType} memory added to shared pool`);
    
    setTimeout(() => {
      setSyncStatus('idle');
      addBondEvent('Memory synchronized across all bonded replicas');
    }, 1500);
  };

  const handleUpdateBondSettings = (setting: string, value: any) => {
    setBondSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    addBondEvent(`Bond setting updated: ${setting} = ${value}`);
    
    if (setting === 'syncFrequency' && value === 'manual') {
      addBondEvent('Switched to manual synchronization mode');
    }
  };

  const handleManualSync = () => {
    if (!isBonded) return;
    
    setSyncStatus('syncing');
    addBondEvent('Manual synchronization initiated');
    
    setTimeout(() => {
      setSyncStatus('idle');
      addBondEvent('Manual synchronization completed');
    }, 2000);
  };

  const handleUpdateReplicaPermission = (replicaId: string, permission: 'read' | 'write' | 'admin') => {
    const updatedReplicas = replicas.map(replica => 
      replica.id === replicaId 
        ? { ...replica, bondPermission: permission }
        : replica
    );
    
    setReplicas(updatedReplicas);
    addBondEvent(`Permission updated for ${replicas.find(r => r.id === replicaId)?.name}: ${permission}`);
  };

  const addBondEvent = (event: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setBondEvents(prev => [`[${timestamp}] ${event}`, ...prev.slice(0, 9)]);
  };

  const getMemoryTypeColor = (type: string) => {
    switch (type) {
      case 'explicit': return 'bg-blue-100 text-blue-800';
      case 'implicit': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMemoryCategoryIcon = (category: string) => {
    switch (category) {
      case 'userPreferences': return <Users className="h-4 w-4" />;
      case 'projectData': return <Database className="h-4 w-4" />;
      case 'conversationHistory': return <MessageSquare className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-6"> 
      <h1 className="text-2xl font-bold mb-2 text-gray-100">Bonding Replicas</h1> 
      <p className="mb-6 text-sm text-gray-300"> 
        Create shared states and memories between multiple AI replicas for enhanced collaboration.
      </p>

      <div className="bg-white rounded-lg shadow-lg flex-1 overflow-hidden">
        <div className="border-b border-gray-200 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${isBonded ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="font-medium text-gray-700">Bond Status:</span>
            <Badge variant={isBonded ? "outline" : "secondary"} className="ml-2">
              {isBonded ? 'Active' : 'Inactive'}
            </Badge>
            {isBonded && bondId && (
              <span className="ml-4 text-xs text-gray-500">ID: {bondId}</span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={isBonded} 
                onCheckedChange={handleToggleBonding}
                id="bond-toggle"
              />
              <label
                htmlFor="bond-toggle"
                className="cursor-pointer"
                onClick={() => handleToggleBonding()}
              >
                {isBonded ? 'Disable Bond' : 'Enable Bond'}
              </label>
            </div>
            
            {isBonded && (
              <div className="flex items-center">
                <span className={`text-xs ${syncStatus === 'syncing' ? 'text-blue-600' : 'text-gray-500'}`}>
                  {syncStatus === 'syncing' ? 'Synchronizing...' : 'Synchronized'}
                </span>
                {bondSettings.syncFrequency === 'manual' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2"
                    onClick={handleManualSync}
                  >
                    Sync Now
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 flex-1">
          <div className="col-span-1 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Bonded Replicas</h2>
              <div className="space-y-3">
                {replicas.map(replica => (
                  <div key={replica.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{replica.name}</h3>
                        <p className="text-xs text-gray-500">{replica.specialty}</p>
                      </div>
                      <Badge variant={replica.bondStatus === 'bonded' ? "outline" : "secondary"} className="text-xs">
                        {replica.bondStatus}
                      </Badge>
                    </div>
                    
                    {isBonded && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Permission:</span>
                          <select 
                            value={replica.bondPermission}
                            onChange={(e) => handleUpdateReplicaPermission(replica.id, e.target.value as 'read' | 'write' | 'admin')}
                            disabled={!isBonded}
                            className="h-7 w-24 text-xs border border-gray-300 rounded px-2"
                          >
                            <option value="read">Read</option>
                            <option value="write">Write</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {isBonded && (
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Bond Details</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created:</span>
                    <span className="font-medium">{bondCreationTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expires:</span>
                    <span className="font-medium">{bondExpiryTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Strength:</span>
                    <span className="font-medium">{bondStrength}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sync Mode:</span>
                    <span className="font-medium capitalize">{bondSettings.syncFrequency}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="col-span-1 md:col-span-3 flex flex-col">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b border-gray-200">
                <TabsList className="p-0 bg-transparent border-b-0 h-12">
                  <TabsTrigger value="memory" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none">
                    <Link className="h-4 w-4 mr-2" />
                    Shared Memory
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none">
                    <Settings className="h-4 w-4 mr-2" />
                    Bond Settings
                  </TabsTrigger>
                  <TabsTrigger value="events" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none">
                    <Clock className="h-4 w-4 mr-2" />
                    Bond Events
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="memory" className="flex-1 p-0 mt-0">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-md font-semibold mb-2 text-gray-700">Shared Memory Pool</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {isBonded 
                      ? 'All bonded replicas can access and contribute to this shared memory pool.'
                      : 'Enable bonding to create a shared memory pool between replicas.'}
                  </p>
                  
                  {isBonded && (
                    <div className="flex flex-col md:flex-row gap-2">
                      <div className="flex-1">
                        <Textarea 
                          placeholder="Add new memory to the shared pool..." 
                          value={newMemoryInput}
                          onChange={(e) => setNewMemoryInput(e.target.value)}
                          className="resize-none"
                        />
                      </div>
                      <div className="flex flex-col md:flex-row gap-2">
                        <select
                          value={selectedMemoryType}
                          onChange={(e) => setSelectedMemoryType(e.target.value as 'explicit' | 'implicit')}
                          className="w-[130px] border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="explicit">Explicit</option>
                          <option value="implicit">Implicit</option>
                        </select>
                        
                        <select
                          value={selectedMemoryCategory}
                          onChange={(e) => setSelectedMemoryCategory(e.target.value)}
                          className="w-[180px] border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="userPreferences">User Preferences</option>
                          <option value="projectData">Project Data</option>
                          <option value="conversationHistory">Conversation History</option>
                        </select>
                        
                        <Button onClick={handleAddMemory}>Add Memory</Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 overflow-y-auto flex-1">
                  {isBonded && sharedMemory.length > 0 ? (
                    <div className="space-y-3">
                      {sharedMemory.map((memory) => (
                        <div key={memory.id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <Badge className={`mr-2 ${getMemoryTypeColor(memory.type)}`}>
                                {memory.type}
                              </Badge>
                              <span className="text-xs text-gray-500 flex items-center">
                                {getMemoryCategoryIcon(memory.category)}
                                <span className="ml-1">{memory.category}</span>
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">{memory.timestamp}</span>
                          </div>
                          <p className="text-gray-800">{memory.content}</p>
                          <div className="mt-2 text-xs text-gray-500 text-right">
                            Source: {memory.source}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      {isBonded ? (
                        <>
                          <Database className="h-12 w-12 text-gray-300 mb-2" />
                          <p>No shared memories yet. Add some using the form above.</p>
                        </>
                      ) : (
                        <>
                          <Lock className="h-12 w-12 text-gray-300 mb-2" />
                          <p>Enable bonding to access shared memory.</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="flex-1 p-0 mt-0">
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Bond Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label htmlFor="bond-strength" className="text-sm font-medium">Bond Strength</label>
                          <span className="text-sm text-gray-500">{bondStrength}%</span>
                        </div>
                        <input
                          id="bond-strength"
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={bondStrength}
                          onChange={(e) => setBondStrength(parseInt(e.target.value))}
                          disabled={!isBonded}
                          className="w-full mb-6"
                        />
                        <p className="text-xs text-gray-500">
                          Higher bond strength increases the depth and fidelity of shared information, but requires more computational resources.
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="bond-duration" className="text-sm font-medium block mb-2">Bond Duration (hours)</label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="bond-duration"
                            type="number"
                            min={0}
                            value={bondSettings.duration}
                            onChange={(e) => handleUpdateBondSettings('duration', parseInt(e.target.value) || 0)}
                            disabled={!isBonded}
                            className="w-24"
                          />
                          <span className="text-sm text-gray-500">
                            {bondSettings.duration === 0 ? '(Permanent)' : `(Expires: ${bondExpiryTime})`}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium block mb-2">Synchronization Frequency</label>
                        <select
                          value={bondSettings.syncFrequency}
                          onChange={(e) => handleUpdateBondSettings('syncFrequency', e.target.value)}
                          disabled={!isBonded}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="realtime">Real-time</option>
                          <option value="periodic">Periodic</option>
                          <option value="manual">Manual</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium block mb-2">Default Permission Level</label>
                        <select
                          value={bondSettings.permissionLevel}
                          onChange={(e) => handleUpdateBondSettings('permissionLevel', e.target.value)}
                          disabled={!isBonded}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="read">Read Only</option>
                          <option value="write">Read & Write</option>
                          <option value="admin">Admin (Full Control)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Shared Data Scope</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="scope-userPreferences"
                          checked={bondSettings.scope.includes('userPreferences')}
                          onChange={(e) => {
                            const newScope = e.target.checked 
                              ? [...bondSettings.scope, 'userPreferences'] 
                              : bondSettings.scope.filter(s => s !== 'userPreferences');
                            handleUpdateBondSettings('scope', newScope);
                          }}
                          disabled={!isBonded}
                          className="mr-2"
                        />
                        <label htmlFor="scope-userPreferences" className="text-sm">User Preferences</label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="scope-projectData"
                          checked={bondSettings.scope.includes('projectData')}
                          onChange={(e) => {
                            const newScope = e.target.checked 
                              ? [...bondSettings.scope, 'projectData'] 
                              : bondSettings.scope.filter(s => s !== 'projectData');
                            handleUpdateBondSettings('scope', newScope);
                          }}
                          disabled={!isBonded}
                          className="mr-2"
                        />
                        <label htmlFor="scope-projectData" className="text-sm">Project Data</label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="scope-conversationHistory"
                          checked={bondSettings.scope.includes('conversationHistory')}
                          onChange={(e) => {
                            const newScope = e.target.checked 
                              ? [...bondSettings.scope, 'conversationHistory'] 
                              : bondSettings.scope.filter(s => s !== 'conversationHistory');
                            handleUpdateBondSettings('scope', newScope);
                          }}
                          disabled={!isBonded}
                          className="mr-2"
                        />
                        <label htmlFor="scope-conversationHistory" className="text-sm">Conversation History</label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="events" className="flex-1 p-0 mt-0">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-md font-semibold mb-2 text-gray-700">Bond Activity Log</h3>
                  <p className="text-sm text-gray-500">
                    Real-time monitoring of bond events, synchronization, and memory updates.
                  </p>
                </div>
                
                <div className="p-4 overflow-y-auto flex-1">
                  {bondEvents.length > 0 ? (
                    <div className="space-y-1">
                      {bondEvents.map((event, index) => (
                        <div key={index} className="text-sm border-b border-gray-100 py-1 last:border-0">
                          {event}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <Clock className="h-12 w-12 text-gray-300 mb-2" />
                      <p>No bond events recorded yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">
            This prototype demonstrates the Bonding Replicas concept, allowing multiple AI replicas to establish shared memory, goals, and states.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BondingReplicasPage;
