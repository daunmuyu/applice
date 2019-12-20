export interface IRunner {
    onSuccessed: IRunner;
    onError: IRunner;

    run(param): void;
}