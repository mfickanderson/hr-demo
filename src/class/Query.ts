import { API, graphqlOperation } from 'aws-amplify'
import * as queries from 'graphql/queries'
import * as mutations from 'graphql/mutations'

import { Department, Employee } from 'API'
import { DEFAULT_DATE_FORMAT, hasStringValue } from 'utils/Constants'
import dayjs from 'dayjs'

export class Query {

    private get: any = async (query: any, additionalParam: any) => {
        return await API.graphql(graphqlOperation(query, additionalParam))
    }

    private update: any = async (mutation: any, params: any) => {
        return await API.graphql(graphqlOperation(mutation, { input: params }))
    }

    getDepartments = async () => {
        const results = await this.get(queries.listDepartments)
        return results.data.listDepartments.items as Department[]
    }

    getDepartment = async (departmentId: number) => {
        const results = await this.get(queries.getDepartment, { id: departmentId })
        return results.data.getDepartment as Department
    }

    saveDepartment = async (department: any) => {
        return await this.update(mutations.createDepartment, department)
    }

    getEmployees = async () => {
        const results = await this.get(queries.listEmployees)
        return results.data.listEmployees.items as Employee[]
    }

    saveEmployee = async (employee: any, randomUserHeadShotUrl: string) => {
        employee.hireDate = dayjs(employee.hireDate).format(DEFAULT_DATE_FORMAT)
        employee.headshot = randomUserHeadShotUrl
        if (hasStringValue(employee.id)) {
            return await this.update(mutations.updateEmployee, employee)
        }
        else {
            return await this.update(mutations.createEmployee, employee)
        }
    }

    deleteEmployee = async (employeeId: any) => {
        return await this.update(mutations.deleteEmployee, { id: employeeId })
    }
}
