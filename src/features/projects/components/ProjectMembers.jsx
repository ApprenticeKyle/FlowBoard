import { useState, useEffect } from 'react';
import { UserPlus, X, Search, MoreVertical, Crown, Shield, User, Mail, Phone, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button, Card, Input, Modal } from '@shared/ui';
import { useToastStore } from '@shared/store/toastStore';
import { useConfirmStore } from '@shared/store/confirmStore';
import { apiClient } from '@shared/utils/apiClient';

// 成员角色
const MEMBER_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
};

const ROLE_LABELS = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
};

const ROLE_ICONS = {
  owner: Crown,
  admin: Shield,
  member: User,
};

const ROLE_COLORS = {
  owner: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  admin: 'bg-primary-500/20 text-primary-400 border-primary-500/30',
  member: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export default function ProjectMembers({ projectId, members = [], teams = [], onMembersChange }) {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToastStore();
  const { openConfirm } = useConfirmStore();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [memberMenus, setMemberMenus] = useState({});

  // 加载项目关联团队下的所有用户
  useEffect(() => {
    if (isAddModalOpen && !searchQuery) {
      const fetchProjectTeamUsers = async () => {
        setLoadingUsers(true);
        try {
          // 获取项目关联的所有团队ID
          const teamIds = teams.map(team => team.id).filter(id => id != null);
          
          if (teamIds.length === 0) {
            setAvailableUsers([]);
            return;
          }
          
          // 根据团队ID列表查询所有用户（使用POST，参数放在body中）
          const allUsers = await apiClient.post('/projects/members/available', { teamIds });
          
          // 过滤掉已经是项目成员的用户
          const existingMemberIds = members.map(m => m.userId || m.id);
          const filteredUsers = (allUsers || []).filter(user => 
            !existingMemberIds.includes(user.id || user.userId)
          );
          
          setAvailableUsers(filteredUsers);
        } catch (error) {
          console.error('Failed to fetch project team users:', error);
          setAvailableUsers([]);
        } finally {
          setLoadingUsers(false);
        }
      };
      
      fetchProjectTeamUsers();
    } else if (isAddModalOpen && searchQuery) {
      // 使用搜索
      const searchUsers = async () => {
        setLoadingUsers(true);
        try {
          const searchResults = await apiClient.get(`/projects/users/search?keyword=${encodeURIComponent(searchQuery)}`);
          const existingMemberIds = members.map(m => m.userId || m.id);
          const filteredUsers = (searchResults || []).filter(user => !existingMemberIds.includes(user.id || user.userId));
          setAvailableUsers(filteredUsers);
        } catch (error) {
          console.error('Failed to search users:', error);
          setAvailableUsers([]);
        } finally {
          setLoadingUsers(false);
        }
      };
      const timer = setTimeout(searchUsers, 300);
      return () => clearTimeout(timer);
    }
  }, [isAddModalOpen, searchQuery, teams, members]);

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      showError(t('projects.members.selectUsers'));
      return;
    }

    try {
      setLoading(true);
      await apiClient.post(`/projects/${projectId}/members`, {
        userIds: selectedUsers.map(u => u.id || u.userId),
        role: MEMBER_ROLES.MEMBER
      });
      
      // 刷新成员列表
      const projectData = await apiClient.get(`/projects/${projectId}`);
      onMembersChange?.(projectData.projectMembers || []);
      
      showSuccess(t('projects.members.addSuccess'));
      setIsAddModalOpen(false);
      setSelectedUsers([]);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to add members:', error);
      showError(t('projects.members.addError'));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = (member) => {
    openConfirm({
      title: t('projects.members.removeConfirmTitle'),
      message: t('projects.members.removeConfirmMessage', { name: member.name }),
      onConfirm: async () => {
        try {
          const userId = member.userId || member.id;
          await apiClient.delete(`/projects/${projectId}/members/${userId}`);
          const updatedMembers = members.filter(m => (m.userId || m.id) !== userId);
          onMembersChange?.(updatedMembers);
          showSuccess(t('projects.members.removeSuccess'));
        } catch (error) {
          console.error('Failed to remove member:', error);
          showError(t('projects.members.removeError'));
        }
      },
    });
  };

  const handleChangeRole = async (member, newRole) => {
    try {
      const userId = member.userId || member.id;
      await apiClient.put(`/projects/${projectId}/members/${userId}/role?role=${newRole}`);
      const updatedMembers = members.map(m => 
        (m.userId || m.id) === userId ? { ...m, role: newRole } : m
      );
      onMembersChange?.(updatedMembers);
      showSuccess(t('projects.members.roleUpdateSuccess'));
      const memberId = member.id || member.userId;
      setMemberMenus({ ...memberMenus, [memberId]: false });
    } catch (error) {
      console.error('Failed to update role:', error);
      showError(t('projects.members.roleUpdateError'));
    }
  };

  const toggleMemberMenu = (memberId) => {
    setMemberMenus({ ...memberMenus, [memberId]: !memberMenus[memberId] });
  };

  const filteredAvailableUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500';
      case 'away':
        return 'bg-amber-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{t('projects.members.title')}</h3>
            <p className="text-slate-400 text-sm">{t('projects.members.subtitle', { count: members.length })}</p>
          </div>
          <Button
            icon={UserPlus}
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
          >
            {t('projects.members.addMember')}
          </Button>
        </div>

        {members.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-400 mb-4">{t('projects.members.empty')}</p>
            <Button
              icon={UserPlus}
              onClick={() => setIsAddModalOpen(true)}
              size="sm"
              variant="secondary"
            >
              {t('projects.members.addFirstMember')}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => {
              const RoleIcon = ROLE_ICONS[member.role] || User;
              const memberId = member.id || member.userId;
              const isMenuOpen = memberMenus[memberId];

              return (
                <motion.div
                  key={memberId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
                >
                  {/* 头像 */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border-2 border-white/10">
                      <img
                        src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0b0f1a] ${getStatusColor(member.status || 'offline')}`}></span>
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold truncate">{member.name}</h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${ROLE_COLORS[member.role] || ROLE_COLORS.member}`}>
                        <RoleIcon className="w-3 h-3" />
                        {ROLE_LABELS[member.role] || 'Member'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      {member.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 操作菜单 */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => toggleMemberMenu(memberId)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {isMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="py-1">
                            {Object.entries(MEMBER_ROLES).map(([key, value]) => {
                              if (member.role === value) return null;
                              const Icon = ROLE_ICONS[value];
                              return (
                                <button
                                  key={value}
                                  onClick={() => handleChangeRole(member, value)}
                                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                                >
                                  <Icon className="w-4 h-4" />
                                  {t(`projects.members.roles.${value}`)}
                                </button>
                              );
                            })}
                            <div className="h-px bg-white/5 my-1" />
                            <button
                              onClick={() => {
                                handleRemoveMember(member);
                                setMemberMenus({ ...memberMenus, [memberId]: false });
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                            >
                              {t('projects.members.remove')}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>

      {/* 添加成员模态框 */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSearchQuery('');
          setSelectedUsers([]);
        }}
        title={t('projects.members.addMember')}
        size="lg"
      >
        <div className="space-y-6">
          {/* 关联团队提示 */}
          {teams.length > 0 && (
            <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4">
              <p className="text-sm text-slate-300 mb-2">
                {t('projects.members.associatedTeams')}
              </p>
              <div className="flex flex-wrap gap-2">
                {teams.map((team) => (
                  <span
                    key={team.id}
                    className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-lg text-sm font-medium"
                  >
                    {team.name}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {t('projects.members.teamUsersHint')}
              </p>
            </div>
          )}

          {/* 搜索 */}
          <div>
              <Input
                type="search"
                placeholder={t('projects.members.searchUsers')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
          </div>

          {/* 已选择的用户 */}
          {selectedUsers.length > 0 && (
            <div>
              <p className="text-sm text-slate-400 mb-2">{t('projects.members.selected', { count: selectedUsers.length })}</p>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => {
                  const userId = user.id || user.userId;
                  return (
                    <div
                      key={userId}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 border border-primary-500/30 rounded-lg"
                    >
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name}
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-sm text-white">{user.name}</span>
                      <button
                        onClick={() => setSelectedUsers(selectedUsers.filter(u => (u.id || u.userId) !== userId))}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 可用用户列表 */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {loadingUsers ? (
              <div className="py-8 text-center text-slate-400">
                <p>{t('common.loading')}</p>
              </div>
            ) : filteredAvailableUsers.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <p>{t('projects.members.noUsersFound')}</p>
                {teams.length === 0 && (
                  <p className="text-xs mt-2">{t('projects.members.noTeamsHint')}</p>
                )}
              </div>
            ) : (
              filteredAvailableUsers.map((user) => {
                const isSelected = selectedUsers.some(u => (u.id || u.userId) === (user.id || user.userId));
                return (
                  <button
                    key={user.id || user.userId}
                    onClick={() => {
                      const userId = user.id || user.userId;
                      if (isSelected) {
                        setSelectedUsers(selectedUsers.filter(u => (u.id || u.userId) !== userId));
                      } else {
                        setSelectedUsers([...selectedUsers, user]);
                      }
                    }}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-primary-500/20 border-2 border-primary-500/50'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-white font-semibold">{user.name}</h4>
                      <p className="text-sm text-slate-400">{user.email}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Button
              variant="ghost"
              onClick={() => {
                setIsAddModalOpen(false);
                setSearchQuery('');
                setSelectedUsers([]);
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleAddMembers}
              loading={loading}
              disabled={selectedUsers.length === 0}
            >
              {t('projects.members.add')} {selectedUsers.length > 0 && `(${selectedUsers.length})`}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

