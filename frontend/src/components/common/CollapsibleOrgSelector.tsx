import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Building2, 
  ChevronDown, 
  ChevronRight, 
  Check, 
  Search, 
  ChevronsUpDown, 
  Briefcase, 
  FolderTree, 
  MapPin, 
  Layers,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import { Organisation, OrgType } from '../../types';

interface TreeNode extends Organisation {
  children: TreeNode[];
}

interface CollapsibleOrgSelectorProps {
  organisations: Organisation[];
  selectedOrgId: string;
  onSelectOrg: (id: string) => void;
  userRole?: string;
}

export const CollapsibleOrgSelector: React.FC<CollapsibleOrgSelectorProps> = ({
  organisations,
  selectedOrgId,
  onSelectOrg,
  userRole
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Selected organization object
  const selectedOrg = useMemo(() => {
    return organisations.find(o => o.id === selectedOrgId) || organisations[0];
  }, [organisations, selectedOrgId]);

  // Build tree from flat organisations list
  const treeRoots = useMemo<TreeNode[]>(() => {
    const map = new Map<string, TreeNode>();
    organisations.forEach(item => {
      map.set(item.id, { ...item, children: [] });
    });

    const roots: TreeNode[] = [];
    organisations.forEach(item => {
      const node = map.get(item.id)!;
      if (item.parentId && map.has(item.parentId)) {
        map.get(item.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [organisations]);

  // Initialize expanded set: Default to root and top subsidiaries expanded for Admin & CSO
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    organisations.forEach(o => {
      if (o.type === 'GROUP' || o.type === 'SUBSIDIARY') {
        initial.add(o.id);
      }
    });
    return initial;
  });

  // Close on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Toggle single node expanded state
  const toggleNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Expand / Collapse All
  const handleToggleAll = (expand: boolean) => {
    if (expand) {
      const allBranchIds = new Set<string>();
      organisations.forEach(o => {
        if (o.type !== 'PROJECT') allBranchIds.add(o.id);
      });
      setExpandedNodes(allBranchIds);
    } else {
      setExpandedNodes(new Set());
    }
  };

  const isAllExpanded = useMemo(() => {
    const branchCount = organisations.filter(o => o.type !== 'PROJECT').length;
    return expandedNodes.size >= branchCount;
  }, [organisations, expandedNodes]);

  // Node selection handler
  const handleSelectNode = (orgId: string) => {
    onSelectOrg(orgId);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Count project sites nested under any node
  const countSites = (node: TreeNode): number => {
    if (node.type === 'PROJECT') return 1;
    return (node.children || []).reduce((acc, child) => acc + countSites(child), 0);
  };

  // Type badge styling
  const getTypeBadge = (type: OrgType) => {
    switch (type) {
      case 'GROUP':
        return {
          label: 'GROUP HQ',
          className: 'bg-[#EF272E] text-white',
          icon: <Layers className="w-3.5 h-3.5 text-red-500" />
        };
      case 'SUBSIDIARY':
        return {
          label: 'SUBSIDIARY',
          className: 'bg-[#1A2A6C] text-white',
          icon: <Briefcase className="w-3.5 h-3.5 text-blue-600" />
        };
      case 'BUSINESS_UNIT':
        return {
          label: 'BUSINESS UNIT',
          className: 'bg-[#475569] text-white',
          icon: <FolderTree className="w-3.5 h-3.5 text-indigo-500" />
        };
      case 'PROJECT':
        return {
          label: 'PROJECT / SITE',
          className: 'bg-emerald-700 text-white',
          icon: <MapPin className="w-3.5 h-3.5 text-emerald-600" />
        };
      default:
        return {
          label: type,
          className: 'bg-gray-600 text-white',
          icon: <Building2 className="w-3.5 h-3.5 text-gray-500" />
        };
    }
  };

  // Filter helper: checks if a node or any of its descendants matches query
  const matchesSearch = (node: TreeNode, query: string): boolean => {
    if (!query) return true;
    const q = query.toLowerCase();
    const selfMatch = 
      node.name.toLowerCase().includes(q) ||
      node.code.toLowerCase().includes(q) ||
      (node.city && node.city.toLowerCase().includes(q)) ||
      (node.state && node.state.toLowerCase().includes(q)) ||
      (node.businessVertical && node.businessVertical.toLowerCase().includes(q));
    
    if (selfMatch) return true;
    return (node.children || []).some(child => matchesSearch(child, query));
  };

  // Recursive Tree Item Renderer
  const renderTreeItem = (node: TreeNode, depth: number = 0) => {
    if (searchQuery && !matchesSearch(node, searchQuery)) {
      return null;
    }

    const hasChildren = node.children && node.children.length > 0;
    // When searching, auto-expand so matching items are visible
    const isExpanded = searchQuery ? true : expandedNodes.has(node.id);
    const isSelected = selectedOrgId === node.id;
    const badge = getTypeBadge(node.type);
    const siteCount = countSites(node);

    const paddingLeftClass = 
      depth === 0 ? 'pl-2' :
      depth === 1 ? 'pl-6' :
      depth === 2 ? 'pl-11' :
      'pl-16';

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => handleSelectNode(node.id)}
          className={`group flex items-center justify-between py-1.5 pr-3 text-xs rounded-[3px] cursor-pointer transition-all ${
            paddingLeftClass
          } ${
            isSelected 
              ? 'bg-[#1A2A6C]/10 text-[#1A2A6C] font-semibold border-l-2 border-[#1A2A6C]' 
              : 'hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 border-l-2 border-transparent'
          }`}
          title={`Click to set active reporting scope: ${node.name}`}
        >
          {/* Left: Expand Toggle + Icon + Name */}
          <div className="flex items-center space-x-1.5 min-w-0 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleNode(node.id, e)}
                className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-[2px] transition-colors shrink-0"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-4 shrink-0" />
            )}

            <div className="shrink-0">{badge.icon}</div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span className={`truncate text-xs ${isSelected ? 'font-bold text-[#1A2A6C]' : 'font-medium'}`}>
                  {node.name}
                </span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#EF272E] shrink-0 stroke-[2.5]" />
                )}
              </div>

              {/* Subtitle / Details */}
              <div className="flex items-center space-x-2 text-[10px] text-slate-500 truncate">
                <span className="font-mono text-slate-400">{node.code}</span>
                {node.type !== 'PROJECT' && siteCount > 0 && (
                  <span>• {siteCount} {siteCount === 1 ? 'Site' : 'Sites'}</span>
                )}
                {node.type === 'PROJECT' && node.city && (
                  <span>• {node.city}, {node.state}</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Tier Badge */}
          <div className="shrink-0 ml-2">
            <span className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-[2px] ${badge.className}`}>
              {badge.label}
            </span>
          </div>
        </div>

        {/* Children Render with vertical guide line */}
        {hasChildren && isExpanded && (
          <div className="relative border-l border-slate-200 ml-4 my-0.5">
            {node.children.map(child => renderTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const selectedBadge = getTypeBadge(selectedOrg?.type || 'GROUP');

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button in Topbar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-[#121c4a] hover:bg-[#18255e] px-3 py-1.5 rounded-[2px] border border-white/15 transition-all text-left shadow-sm group"
        title="Change Active Corporate Reporting Scope (Collapsible Hierarchy)"
      >
        <Building2 className="w-4 h-4 text-[#38bdf8] shrink-0 group-hover:scale-105 transition-transform" />
        
        <div className="flex items-center space-x-2 max-w-[280px] sm:max-w-[340px]">
          <span className="text-xs font-bold text-white truncate">
            {selectedOrg?.name || 'MEIL Group'}
          </span>
          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-[2px] shrink-0 ${selectedBadge.className}`}>
            {selectedBadge.label}
          </span>
        </div>

        <ChevronDown 
          className={`w-3.5 h-3.5 text-[#C6CBE6] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`} 
        />
      </button>

      {/* Collapsible Tree Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-[380px] sm:w-[450px] bg-white text-slate-800 border border-slate-300 shadow-2xl rounded-[3px] z-50 overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-100">
          {/* Header */}
          <div className="bg-[#1A2A6C] text-white px-3.5 py-2.5 flex items-center justify-between border-b border-[#0f1b4c]">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#EF272E]" />
              <div>
                <span className="text-xs font-bold block leading-none">Corporate Statutory Hierarchy</span>
                <span className="text-[10px] text-[#C6CBE6] leading-none mt-0.5 block">
                  Select reporting node for rollups &amp; assurance
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleAll(!isAllExpanded)}
              className="flex items-center space-x-1 text-[10px] font-semibold bg-[#121c4a] hover:bg-[#203175] text-[#C6CBE6] hover:text-white px-2 py-1 rounded-[2px] border border-white/15 transition-colors"
              title={isAllExpanded ? 'Collapse All Levels' : 'Expand All Levels'}
            >
              <ChevronsUpDown className="w-3 h-3" />
              <span>{isAllExpanded ? 'Collapse All' : 'Expand All'}</span>
            </button>
          </div>

          {/* Quick Search Bar */}
          <div className="p-2.5 border-b border-slate-200 bg-slate-50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search unit, subsidiary, project or site..."
                className="w-full bg-white border border-slate-300 rounded-[2px] pl-8 pr-7 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1A2A6C] focus:ring-1 focus:ring-[#1A2A6C]"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Tree View Scroll Area */}
          <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-100">
            {treeRoots.length > 0 ? (
              treeRoots.map(root => renderTreeItem(root, 0))
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                No accessible units found for current role.
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="bg-slate-50 px-3.5 py-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center space-x-1.5 truncate">
              <span className="font-semibold text-slate-500">Active Scope:</span>
              <span className="font-bold text-[#1A2A6C] truncate">{selectedOrg?.name}</span>
            </div>
            <span className="text-[10px] text-slate-400 shrink-0 ml-2">
              4-Tier Statutory Rollup
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
