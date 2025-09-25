import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';

import styles from './ArticleParamsForm.module.scss';
import { useState, useRef, useEffect } from 'react';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Text } from 'src/ui/text';
import { Separator } from 'src/ui/separator';
import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
} from 'src/constants/articleProps';

// Определение типа пропсов компонента
type ArticleProps = {
	initialValues: ArticleStateType; // Начальные значения формы
	onUpdate: (styles: Partial<ArticleStateType>) => void; // Колбэк для обновления стилей
	onReset: () => void; // Колбэк для сброса к начальным значениям
};

export const ArticleParamsForm = ({
	initialValues,
	onUpdate,
	onReset,
}: ArticleProps) => {
	// Refs для элементов DOM
	const sidebarRef = useRef<HTMLDivElement>(null); // Ref для боковой панели
	const arrowRef = useRef<HTMLDivElement>(null); // Ref для кнопки-стрелки

	// Состояние открытия/закрытия панели
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	// Локальное состояние формы
	const [formState, setFormState] = useState<ArticleStateType>(initialValues);

	// Эффект для обработки кликов вне области панели
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			// Проверяем, был ли клик вне панели и кнопки
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(e.target as Node) &&
				arrowRef.current &&
				!arrowRef.current.contains(e.target as Node)
			) {
				setIsMenuOpen(false); // Закрываем панель
			}
		};

		// Добавляем обработчик только когда панель открыта
		if (isMenuOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		// Убираем обработчик при размонтировании
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isMenuOpen]); // Зависимость от состояния isMenuOpen

	// Обработчик отправки формы
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onUpdate(formState); // Передаем текущее состояние формы
	};

	// Обработчик сброса формы
	const handleReset = (e: React.FormEvent) => {
		e.preventDefault();
		setFormState(initialValues); // Сбрасываем локальное состояние
		onReset(); // Вызываем колбэк сброса
	};

	return (
		<>
			{/* Кнопка для открытия/закрытия панели */}
			<ArrowButton
				ref={arrowRef}
				isOpen={isMenuOpen}
				onClick={() => {
					setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
				}}
			/>

			{/* Боковая панель с формой */}
			<aside
				ref={sidebarRef}
				className={
					isMenuOpen
						? `${styles.container} ${styles.container_open}`
						: styles.container
				}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					{/* Заголовок формы */}
					<Text as='h2' size={31} weight={800} uppercase dynamicLite>
						Задайте параметры
					</Text>

					{/* Поле выбора шрифта */}
					<Select
						title='Шрифт'
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={(opt) =>
							setFormState((prev) => ({ ...prev, fontFamilyOption: opt }))
						}
					/>

					{/* Группа радиокнопок для выбора размера шрифта */}
					<RadioGroup
						title='Размер шрифта'
						name={'fontSize'}
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={(opt) =>
							setFormState((prev) => ({ ...prev, fontSizeOption: opt }))
						}
					/>

					{/* Разделитель */}
					<Separator />

					{/* Поле выбора цвета текста */}
					<Select
						title='Цвет шрифта'
						selected={formState.fontColor}
						options={fontColors}
						onChange={(opt) =>
							setFormState((prev) => ({ ...prev, fontColor: opt }))
						}></Select>

					{/* Поле выбора цвета фона */}
					<Select
						title='Цвет фона'
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={(opt) =>
							setFormState((prev) => ({ ...prev, backgroundColor: opt }))
						}></Select>

					{/* Поле выбора ширины контента */}
					<Select
						title='Ширина контента'
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={(opt) =>
							setFormState((prev) => ({ ...prev, contentWidth: opt }))
						}></Select>

					{/* Контейнер для кнопок действий */}
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
