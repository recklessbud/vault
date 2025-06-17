import { Request, Response, NextFunction } from 'express';
// import request from "supertest"
import { errorResponse, successResponse } from "../../src/utils/responses.utils"
// import app from '../../src/app'
import { error401Page, error404Page, error500Page, getHomePage } from "../../src/controllers/home.controller"
// import exp from 'constants';

jest.mock('../../src/utils/responses.utils')

describe("Home Controller Tests", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {
            body: {},
            cookies: {},
            ip: "127.0.0.1",
            headers: { "user-agent": "test-agent" },
            user: { id: "user123", username: "testuser", email: "test@example.com" },
        };
        mockResponse = {
            render: jest.fn().mockReturnThis(),
            redirect: jest.fn().mockReturnThis(),
            cookie: jest.fn().mockReturnThis(),
            clearCookie: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();

        (errorResponse as jest.Mock).mockReturnValue(mockResponse);
        (successResponse as jest.Mock).mockReturnValue(mockResponse);
    })

    afterAll(() => {
        jest.resetAllMocks()
    })

    test("getHomePage", async() => {
        await getHomePage(mockRequest as Request, mockResponse as Response, mockNext)
        expect(successResponse).toHaveBeenCalledWith(mockResponse, 200);
        expect(mockResponse.render).toHaveBeenCalledWith("home", { title: "Home" });
    })
    
    test("get500Page", async() => {
        await error500Page(mockRequest as Request, mockResponse as Response, mockNext)
        expect(errorResponse).toHaveBeenCalledWith(mockResponse, 500);
        expect(mockResponse.render).toHaveBeenCalledWith("errors/500", {title: "500 - Internal Server Error", message: "Internal Server Error" });
    })


    test("get401Page", async() => {
        await error401Page(mockRequest as Request, mockResponse as Response, mockNext)
        expect(errorResponse).toHaveBeenCalledWith(mockResponse, 401);
        expect(mockResponse.render).toHaveBeenCalledWith("errors/401", { title: "401 - Unauthorized", message: "Unauthorized" });
    })
    
    test("get400Page", async() => {
        await error404Page(mockRequest as Request, mockResponse as Response, mockNext)
        expect(errorResponse).toHaveBeenCalledWith(mockResponse, 404);
        expect(mockResponse.render).toHaveBeenCalledWith("errors/404",  { title: "404 - Not Found", message: "Not Found" });
    })
 
})