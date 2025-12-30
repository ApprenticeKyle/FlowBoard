-- ====================== 创建所有微服务数据库 ======================

-- 创建并使用项目数据库
CREATE DATABASE IF NOT EXISTS flowstack_project DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE flowstack_project;

-- 创建项目表
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入测试项目数据
INSERT INTO projects (name, description, owner_id) VALUES
('FlowBoard 项目', 'FlowBoard 看板应用开发项目', 1),
('FlowStack 后端', 'FlowStack 微服务后端开发', 1);

-- 创建并使用任务数据库
CREATE DATABASE IF NOT EXISTS flowstack_task DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE flowstack_task;

-- 创建任务表
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    assignee_id BIGINT,
    reporter_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入测试任务数据（项目1）
INSERT INTO tasks (title, description, status, priority, assignee_id, reporter_id, project_id, due_date) VALUES
-- 待办任务
('实现看板拖拽功能', '使用 Framer Motion 实现任务卡片的拖拽功能', 'TODO', 'HIGH', 1, 1, 1, DATE_ADD(NOW(), INTERVAL 7 DAY)),
('添加任务优先级显示', '在任务卡片上显示优先级标记', 'TODO', 'MEDIUM', 2, 1, 1, DATE_ADD(NOW(), INTERVAL 5 DAY)),
('优化移动端显示', '确保看板在移动端有良好的显示效果', 'TODO', 'LOW', 3, 1, 1, DATE_ADD(NOW(), INTERVAL 10 DAY)),

-- 进行中任务
('实现项目统计功能', '在仪表盘页面显示项目统计数据', 'IN_PROGRESS', 'HIGH', 1, 1, 1, DATE_ADD(NOW(), INTERVAL 3 DAY)),
('添加任务评论功能', '允许用户对任务进行评论', 'IN_PROGRESS', 'MEDIUM', 2, 1, 1, DATE_ADD(NOW(), INTERVAL 5 DAY)),

-- 审核任务
('完成用户认证模块', '实现基于 JWT 的用户认证', 'REVIEW', 'HIGH', 3, 1, 1, DATE_ADD(NOW(), INTERVAL 2 DAY)),
('实现任务搜索功能', '允许用户搜索任务', 'REVIEW', 'MEDIUM', 1, 1, 1, DATE_ADD(NOW(), INTERVAL 4 DAY)),

-- 已完成任务
('初始化项目结构', '创建前端项目的基本目录结构', 'DONE', 'MEDIUM', 1, 1, 1, DATE_ADD(NOW(), INTERVAL -1 DAY)),
('实现基本看板布局', '创建看板的基本布局和样式', 'DONE', 'HIGH', 2, 1, 1, DATE_ADD(NOW(), INTERVAL -2 DAY)),
('添加任务卡片组件', '实现任务卡片的显示和交互', 'DONE', 'HIGH', 3, 1, 1, DATE_ADD(NOW(), INTERVAL -3 DAY)),
('实现侧边栏导航', '创建应用的侧边栏导航', 'DONE', 'MEDIUM', 1, 1, 1, DATE_ADD(NOW(), INTERVAL -4 DAY)),
('添加顶部栏', '实现应用的顶部栏', 'DONE', 'LOW', 2, 1, 1, DATE_ADD(NOW(), INTERVAL -5 DAY));

-- 插入测试任务数据（项目2）
INSERT INTO tasks (title, description, status, priority, assignee_id, reporter_id, project_id, due_date) VALUES
('设计微服务架构', '设计 FlowStack 的微服务架构', 'IN_PROGRESS', 'HIGH', 1, 1, 2, DATE_ADD(NOW(), INTERVAL 10 DAY)),
('实现项目服务', '开发项目管理微服务', 'IN_PROGRESS', 'HIGH', 2, 1, 2, DATE_ADD(NOW(), INTERVAL 8 DAY)),
('实现任务服务', '开发任务管理微服务', 'TODO', 'HIGH', 3, 1, 2, DATE_ADD(NOW(), INTERVAL 12 DAY)),
('实现认证服务', '开发用户认证微服务', 'REVIEW', 'MEDIUM', 1, 1, 2, DATE_ADD(NOW(), INTERVAL 6 DAY)),
('实现文件服务', '开发文件存储微服务', 'TODO', 'LOW', 2, 1, 2, DATE_ADD(NOW(), INTERVAL 15 DAY));

-- 创建其他微服务数据库（仅创建数据库，不插入数据）
CREATE DATABASE IF NOT EXISTS flowstack_auth DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS flowstack_file DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS flowstack_notification DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS flowstack_analytics DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
