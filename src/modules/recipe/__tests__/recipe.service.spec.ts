import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from '../recipe.service';
import { getModelToken } from '@nestjs/sequelize';
import { Recipe } from '../../../models/recipe.model';
import { CreateRecipeDto, UpdateRecipeDto } from '../dto';
import { NotFoundException } from '@nestjs/common';

type MockRecipeModel = {
  findAll: jest.Mock;
  findByPk: jest.Mock;
  create: jest.Mock;
  destroy: jest.Mock;
};

describe('RecipeService', () => {
  let service: RecipeService;
  let mockRecipeModel: MockRecipeModel;

  const mockRecipe = {
    id: 1,
    title: 'Test Recipe',
    description: 'Test Description',
    ingredients: ['ingredient1', 'ingredient2'],
    instructions: 'Test instructions',
    cookingTime: 30,
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

      expect(mockRecipeModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedRecipes);
    });
  });

  describe('findById', () => {
    it('should return a recipe by id', async () => {
      mockRecipeModel.findByPk.mockResolvedValue(mockRecipe);

      const result = await service.findById('1');

      expect(mockRecipeModel.findByPk).toHaveBeenCalledWith('1');
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

      const expectedRecipe = { id: 2, ...createRecipeDto };
      mockRecipeModel.create.mockResolvedValue(expectedRecipe);

      const result = await service.create(createRecipeDto);

      expect(mockRecipeModel.create).toHaveBeenCalledWith({
        title: createRecipeDto.title,
        description: createRecipeDto.description,
        ingredients: createRecipeDto.ingredients,
        instructions: createRecipeDto.instructions,
        cookingTime: createRecipeDto.cookingTime,
      });
      expect(result).toEqual(expectedRecipe);
    });
  });

  describe('update', () => {
    it('should update and return a recipe', async () => {
      const updateRecipeDto: UpdateRecipeDto = {
        title: 'Updated Recipe',
        cookingTime: 35,
      };

      mockRecipeModel.findByPk.mockResolvedValue(mockRecipe);
      mockRecipe.update.mockResolvedValue(mockRecipe);

      const result = await service.update('1', updateRecipeDto);

      expect(mockRecipeModel.findByPk).toHaveBeenCalledWith('1');
      expect(mockRecipe.update).toHaveBeenCalledWith({
        title: 'Updated Recipe',
        cookingTime: 35,
      });
      expect(result).toEqual(mockRecipe);
    });

    it('should throw NotFoundException if recipe not found', async () => {
      mockRecipeModel.findByPk.mockResolvedValue(null);

      await expect(service.update('999', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a recipe and return true', async () => {
      mockRecipeModel.destroy.mockResolvedValue(1);

      const result = await service.delete('1');

      expect(mockRecipeModel.destroy).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(true);
    });

    it('should return false if recipe not found', async () => {
      mockRecipeModel.destroy.mockResolvedValue(0);

      const result = await service.delete('999');

      expect(result).toBe(false);
    });
  });
});
