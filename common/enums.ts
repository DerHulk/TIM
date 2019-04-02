export enum TaskStatus{
    None = 0,
    New= 1,
    Updated = 2,
    Deleted = 3,
}

export enum TaskSource {
    Unkown = 0,
    GitLab = 1,
    GitHub = 2,
    TFS = 3,    
}