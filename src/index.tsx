import { createRoot } from 'react-dom/client';
import { StrictMode, CSSProperties, useState } from 'react';
import clsx from 'clsx';
import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import {
	ArticleStateType,
	defaultArticleState,
} from './constants/articleProps';
import './styles/index.scss';
import styles from './styles/index.module.scss';

// Получаем корневой DOM-элемент для монтирования React-приложения
const domNode = document.getElementById('root') as HTMLDivElement;
// Создаем корневой рендер React 18
const root = createRoot(domNode);

// Определение типа для свойств стилей, которые будут применены к статье
export type StyleProps = {
	fontFamily: string;
	fontSize: string;
	fontColor: string;
	containerWidth: string;
	bgColor: string;
};

// Основной компонент приложения
const App = () => {
	// Состояние для хранения текущих стилей статьи
	const [styleState, setStyleState] =
		useState<ArticleStateType>(defaultArticleState);

	// Функция для частичного обновления стилей
	const updateStyles = (updates: Partial<ArticleStateType>) => {
		setStyleState((prev) => ({ ...prev, ...updates }));
	};

	// Функция для сброса стилей к значениям по умолчанию
	const resetStyles = () => {
		setStyleState(defaultArticleState);
	};

	return (
		// Главный контейнер приложения
		<main
			className={clsx(styles.main)}
			// Динамическое применение CSS-переменных на основе состояния
			style={
				{
					'--font-family': styleState.fontFamilyOption.value,
					'--font-size': styleState.fontSizeOption.value,
					'--font-color': styleState.fontColor.value,
					'--container-width': styleState.contentWidth.value,
					'--bg-color': styleState.backgroundColor.value,
				} as CSSProperties // Приведение типа к CSSProperties для TypeScript
			}>
			{/* Форма для настройки параметров статьи */}
			<ArticleParamsForm
				initialValues={defaultArticleState} // Начальные значения формы
				onUpdate={updateStyles} // Колбэк для обновления стилей
				onReset={resetStyles} // Колбэк для сброса стилей
			/>
			{/* Компонент статьи, который использует CSS-переменные */}
			<Article />
		</main>
	);
};

// Рендер приложения в StrictMode для выявления потенциальных проблем
root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
