// MARK: API
import * as api from "@startapp/nvqeb-user-api";

// MARK: Mobx
import { action, observable } from "mobx";

// MARK: Resources
import strings from "../../resources/strings";

// MARK: Stores
import { uiStore } from "../_rootStore";
import VariableChangeHandler from "../../resources/VariableChangeHandler";

export interface IClass {
	name: string;
	id: string;
	scores: {
		min: number;
		mean: number;
		max: number;
	};
}

export interface IProfessor {
	id: string;
	name: string;
	avatar: string;
	hardness: number;
	tags: string[];
	classes: IClass[];
}

export interface IComments {
	name: string;
	comments: string[];
}
{/* Tentativa de criar comentário*/}

export default class ProfessorsStore extends VariableChangeHandler {
    @observable public selectedProfessor: api.Professor | null = null;
	@observable public professors: api.Professor[] = [];

	@observable public loading: boolean = false;
	@observable public pageOffset: number = 0;

	@observable public commentary: string = "";
	@observable public commentaries = [
		{
			user: {
				name: "Arthur Fernandes",
				avatar: null as {url: string} | null,
			},
			commentary: "Excelente aula, finalmente entendi o assunto!",
		},
		{
			user: {
				name: "Filipe Arlindo",
				avatar: null as {url: string} | null,
			},
			commentary: "Excelente aula, mas a prova é barril",
		},
		{
			user: {
				name: "Thiago Mariano",
				avatar: null as {url: string} | null,
			},
			commentary: "Barril, ném vá",
		},
	];

    @action
    public selectProfessor = async (professorId: string) => {
		if (this.loading) {
            return;
		}

		this.loading = true;

		try {
			this.selectedProfessor = this.professors.find((professor) => professor.id === professorId) || await api.getProfessor(professorId);
		} catch (e) {
			uiStore.openErrorSnackbar(e);
		} finally {
			this.loading = false;
		}
	}

	@action
	public getProfessors = async (pageOffset?: number | number) => {
		if (this.loading) {
            return;
		}

		if (!pageOffset) {
			pageOffset = this.pageOffset;
		}

        if (pageOffset < 0) {
			return;
		}

		this.loading = true;

        try {
			const professors = await api.getProfessors(pageOffset);

			if (professors.length > 0) {
				this.professors = professors;
				this.pageOffset = pageOffset;
			} else {
				uiStore.openSnackbar(strings.error.noMoreResults);
			}
        } catch (e) {
            uiStore.openErrorSnackbar(e);
        } finally {
            this.loading = false;
        }
	}

	@action
	public nextPage = async () => {
		this.getProfessors(this.pageOffset + 1);
	}

	@action
	public previousPage = async () => {
		this.getProfessors(this.pageOffset - 1);
	}

	@action
	public sendCommentary = async () => {
		this.commentaries = [
			{
				user: {
					name: "Arthur Fernandes",
					avatar: null as {url: string} | null,
				},
				commentary: this.commentary,
			},
			...this.commentaries,
		];

		this.commentary = "";
	}
}
