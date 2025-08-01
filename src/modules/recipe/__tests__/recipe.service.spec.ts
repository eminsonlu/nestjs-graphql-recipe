import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from '../recipe.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../../../models/user.model';
import { CreateRecipeDto, UpdateRecipeDto } from '../dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Recipe } from '../../../models/recipe.model';

type MockRecipeModel = {
  findAll: jest.Mock;
  findByPk: jest.Mock;
  create: jest.Mock;
  destroy: jest.Mock;
};

describe('RecipeService', () => {
  let service: RecipeService;
  let mockRecipeModel: MockRecipeModel;

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockRecipe = {
    id: 1,
    title: 'Test Recipe',
    description: 'Test Description',
    ingredients: ['ingredient1', 'ingredient2'],
    instructions: 'Test instructions',
    cookingTime: 30,
    userId: mockUser.id,
    user: mockUser,
    update: jest.fn(),
  };

  beforeEach(async () => {
    mockRecipeModel = {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: getModelToken(Recipe),
          useValue: mockRecipeModel,
        },
      ],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of recipes', async () => {
      const expectedRecipes = [mockRecipe];
      mockRecipeModel.findAll.mockResolvedValue(expectedRecipes);

      const result = await service.findAll();

      expect(mockRecipeModel.findAll).toHaveBeenCalledWith({
        include: [User],
      });
      expect(result).toEqual(expectedRecipes);
    });
  });

  describe('findById', () => {
    it('should return a recipe by id', async () => {
      mockRecipeModel.findByPk.mockResolvedValue(mockRecipe);

      const result = await service.findById('1');

      expect(mockRecipeModel.findByPk).toHaveBeenCalledWith('1', {
        include: [User],
      });
      expect(result).toEqual(mockRecipe);
    });

    it('should return null if recipe not found', async () => {
      mockRecipeModel.findByPk.mockResolvedValue(null);

      const result = await service.findById('999');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a recipe', async () => {
      const createRecipeDto: CreateRecipeDto = {
        title: 'New Recipe',
        description: 'New Description',
        ingredients: ['new ingredient'],
        instructions: 'New instructions',
        cookingTime: 25,
      };

      const userId = mockUser.id;
      const createdRecipe = { id: 2, ...createRecipeDto, userId };

      mockRecipeModel.create.mockResolvedValue(createdRecipe);
      mockRecipeModel.findByPk.mockResolvedValue({
        ...createdRecipe,
        user: mockUser,
      });

      await service.create(createRecipeDto, userId);

      expect(mockRecipeModel.create).toHaveBeenCalledWith({
        title: createRecipeDto.title,
        description: createRecipeDto.description,
        ingredients: createRecipeDto.ingredients,
        instructions: createRecipeDto.instructions,
        cookingTime: createRecipeDto.cookingTime,
        userId,
      });
      expect(mockRecipeModel.findByPk).toHaveBeenCalledWith(2, {
        include: [User],
      });
    });
  });

  describe('update', () => {
    it('should update and return a recipe', async () => {
      const updateRecipeDto: UpdateRecipeDto = {
        title: 'Updated Recipe',
        cookingTime: 35,
      };

      const userId = 1;
      mockRecipeModel.findByPk
        .mockResolvedValueOnce(mockRecipe)
        .mockResolvedValueOnce({ ...mockRecipe, ...updateRecipeDto });
      mockRecipe.update.mockResolvedValue(mockRecipe);

      await service.update('1', updateRecipeDto, userId);

      expect(mockRecipeModel.findByPk).toHaveBeenNthCalledWith(1, '1');
      expect(mockRecipe.update).toHaveBeenCalledWith({
        title: 'Updated Recipe',
        cookingTime: 35,
      });
      expect(mockRecipeModel.findByPk).toHaveBeenNthCalledWith(2, '1', {
        include: [User],
      });
    });

    it('should throw NotFoundException if recipe not found', async () => {
      const userId = 1;
      mockRecipeModel.findByPk.mockResolvedValue(null);

      await expect(service.update('999', {}, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      const updateRecipeDto: UpdateRecipeDto = {
        title: 'Updated Recipe',
      };

      const userId = 2;
      const otherUserRecipe = { ...mockRecipe, userId: 1 };
      mockRecipeModel.findByPk.mockResolvedValue(otherUserRecipe);

      await expect(
        service.update('1', updateRecipeDto, userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should delete a recipe when user is owner', async () => {
      const userId = 1;
      mockRecipeModel.findByPk.mockResolvedValue(mockRecipe);
      mockRecipeModel.destroy.mockResolvedValue(1);

      const result = await service.delete('1', userId);

      expect(mockRecipeModel.findByPk).toHaveBeenCalledWith('1');
      expect(mockRecipeModel.destroy).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(true);
    });

    it('should return false if recipe not found', async () => {
      const userId = 1;

      await expect(service.delete('999', userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      const userId = 2;
      const otherUserRecipe = { ...mockRecipe, userId: 1 };
      mockRecipeModel.findByPk.mockResolvedValue(otherUserRecipe);

      await expect(service.delete('1', userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
